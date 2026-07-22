import { useState, useCallback, useContext } from "react";
import type { Task } from "../types/Task";
import { SnackContext } from "../providers/SnackProvider";
import {
	addTask,
	getTasks,
	updateTask,
	deleteTask,
} from "../services/tasksDataServiceFireBase"; // ודא שהנתיב תקין
import { updateUser } from "../services/usersDataServiceFireBase";
import { useAuthState } from "react-firebase-hooks/auth"; // ייבוא של ה-hook
import { getUserById } from "../services/usersDataServiceFireBase";
import { auth } from "../config/firebase"; // ייבוא של אובייקט ה-auth

function useTasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [user] = useAuthState(auth); // קבלת המשתמש המחובר

	const { raiseSnack } = useContext(SnackContext) as any;

	// READ
	const handleGetTasks = useCallback(
		async (boardId?: string) => {
			setIsLoading(true);
			if (!user) {
				setTasks([]);
				setIsLoading(false);
				return;
			}
			try {
				let savedTasks = await getTasks();
				if (boardId) {
					// This is not efficient, we will fix it later by querying by boardId
				}
				// Convert Firestore Timestamps to JS Date objects
				savedTasks = savedTasks.map((task) => {
					if ((task.dueDate as any)?.seconds) {
						task.dueDate = new Date((task.dueDate as any).seconds * 1000);
					}
					return task;
				});
				setTasks(savedTasks);
			} catch (e) {
				raiseSnack("error", "התרחשה שגיאה בייבוא הנתונים");
				setError("Error fetching tasks");
			} finally {
				setIsLoading(false);
			}
		},
		[raiseSnack, user],
	);

	// CREATE
	const handleAddNewTask = useCallback(
		async (task: Omit<Task, "id">) => {
			if (!task.column) {
				raiseSnack("error", "יש לבחור עמודה למשימה");
				return;
			}
			if (!user) {
				raiseSnack("error", "יש להתחבר כדי להוסיף משימה");
				return;
			}

			const newTaskData = {
				...task,
				likes: 0,
				color: task.color || "#ffffff",
				userId: user.uid, // הוספת מזהה המשתמש למשימה
			};

			try {
				// המתנה ליצירת המשימה וקבלת ה-ID מפיירבייס
				const newId = await addTask(newTaskData);

				const newTask: Task = {
					...newTaskData,
					id: newId,
				};

				setTasks((prev) => [...prev, newTask]);
				raiseSnack("success", "משימה חדשה התווספה בהצלחה");
			} catch (error) {
				raiseSnack("error", "התרחשה שגיאה ביצירת המשימה");
			}
		},
		[raiseSnack, user],
	);

	// UPDATE - Move Column (Optimistic Update)
	const moveTaskToColumn = useCallback(
		(taskId: string, columnId: string) => {
			setTasks((prev) => {
				const task = prev.find((t) => t.id === taskId);
				if (!task || task.column === columnId) return prev;

				// עדכון פיירבייס ברקע
				updateTask(taskId, { column: columnId }).catch(() => {
					raiseSnack("error", "שגיאה בשמירת מיקום המשימה");
					// במקרה של שגיאה אפשר לקרוא ל-handleGetTasks כדי לסנכרן חזרה מהשרת
				});

				// עדכון UI מידי
				return prev.map((t) =>
					t.id === taskId ? { ...t, column: columnId } : t,
				);
			});
		},
		[raiseSnack],
	);

	// UPDATE - Full Edit
	const handleEditTask = useCallback(
		async (task: Task) => {
			if (!task.id) return;

			// If task.userId is null/undefined we cannot query owner
			if (!task.userId) {
				raiseSnack("error", "אין לך הרשאה לערוך משימה זו");
				return;
			}
			try {
				// Ensure assigneeId is null if it's an empty string or falsy, to prevent Firebase errors.
				const taskToSave = {
					...task,
					assigneeId: task.assigneeId || null,
				};
				await updateTask(task.id, taskToSave);
				setTasks((prev) =>
					prev.map((t) => (t.id === task.id ? taskToSave : t)),
				);
				raiseSnack("success", "משימה נערכה בהצלחה");
			} catch (error) {
				raiseSnack("error", "שגיאה בעריכת המשימה");
			}
		},
		[raiseSnack, user],
	);

	// DELETE
	const handleDeleteTask = useCallback(
		async (id: string) => {
			const taskToDelete = tasks.find((t) => t.id === id);
			if (!taskToDelete) return;

			// Authorization check
			if (user?.uid !== taskToDelete.userId) {
				// If there's no owner id, cannot query owner
				if (!taskToDelete.userId) {
					raiseSnack("error", "אין לך הרשאה למחוק משימה זו");
					return;
				}
				try {
					const owner = await getUserById(taskToDelete.userId);
					const ownerName = owner?.nickname ?? "משתמש לא ידוע";
					raiseSnack(
						"error",
						`המשימה נוצרה ע"י ${ownerName} ורק לו יש אפשרות למחוק אותה`,
					);
				} catch {
					raiseSnack("error", "אין לך הרשאה למחוק משימה זו");
				}
				return;
			}

			if (confirm("האם את/ה בטוח/ה שברצונך למחוק את המשימה?")) {
				try {
					await deleteTask(id);
					setTasks((prev) => prev.filter((t) => t.id !== id));
					raiseSnack("success", "המשימה נמחקה בהצלחה");
				} catch (error) {
					raiseSnack("error", "שגיאה במחיקת המשימה");
				}
			}
		},
		[raiseSnack, user, tasks],
	);

	// UPDATE - Likes (Optimistic Update)
	const updateLikes = useCallback(
		(taskId: string) => {
			if (!user) {
				raiseSnack("warning", "יש להתחבר כדי לשמור משימה");
				return;
			}

			setTasks((prevTasks) => {
				const taskIndex = prevTasks.findIndex((t) => t.id === taskId);
				if (taskIndex === -1) return prevTasks;

				const originalTask = prevTasks[taskIndex];
				const isSaved = originalTask.savedBy?.includes(user.uid);

				// Toggle saved status
				const newSavedBy = isSaved
					? originalTask.savedBy.filter((uid) => uid !== user.uid)
					: [...(originalTask.savedBy || []), user.uid];

				const newLikes = newSavedBy.length;

				const updatedTask = {
					...originalTask,
					savedBy: newSavedBy,
					likes: newLikes,
				};

				// Optimistic UI update
				const newTasks = [...prevTasks];
				newTasks[taskIndex] = updatedTask;

				// Update Firebase in the background
				Promise.all([
					updateTask(taskId, { savedBy: newSavedBy, likes: newLikes }),
					updateUser(user.uid, {
						savedTasks: isSaved
							? (user as any).savedTasks?.filter((id: string) => id !== taskId) || []
							: [...((user as any).savedTasks || []), taskId],
					}),
				]).catch(() => raiseSnack("error", "שגיאה בעדכון שמירת המשימה"));

				return newTasks;
			});
		},
		[user, raiseSnack],
	);

	return {
		tasks,
		setTasks, // Expose setTasks for sorting
		handleAddNewTask,
		handleEditTask,
		handleDeleteTask,
		handleGetTasks,
		updateLikes,
		moveTaskToColumn,
		isLoading,
		error,
	};
}

export default useTasks;
