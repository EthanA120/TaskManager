import { useState, useCallback, useContext } from "react";
import type { Column } from "../types/Column";
import { SnackContext } from "../providers/SnackProvider";
import {
	addColumn,
	getColumns,
	updateColumn,
	deleteColumn,
} from "../services/columnsDataServiceFireBase"; // ודא שהקובץ קיים והנתיב תקין
import { type Task } from "../types/Task";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

function useColumns() {
	const [columns, setColumns] = useState<Column[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [user] = useAuthState(auth);
  

	const { raiseSnack } = useContext(SnackContext) as {
		raiseSnack: (
			color: "success" | "error" | "warning" | "info",
			message: string,
		) => void;
	};

	// READ
	const handleGetColumns = useCallback(async (boardId?: string) => {
		setIsLoading(true);
		if (!user) {
			setColumns([]);
			setIsLoading(false);
			return;
		}

    try {
			let savedColumns = await getColumns();
			if (boardId) {
				savedColumns = savedColumns.filter(column => column.board === boardId);
			}
			setColumns(savedColumns.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0)));
		} catch {
			raiseSnack("error", "התרחשה שגיאה בייבוא הנתונים");
		} finally {
			setIsLoading(false);
		}
	}, [raiseSnack, user]);

	// CREATE
	const handleAddColumn = useCallback(
		async (column: Omit<Column, "id" | "board">, boardId?: string) => {
			if (!boardId) {
				raiseSnack("error", "לא זוהה מזהה לוח תקין.");
				return;
			}
			const columnData = {
				name: column.name,
				board: boardId,
				color: column.color || "#FFFFFF",
        createdAt: Number(new Date()) || 0,
			};
			try {
				// המתנה ליצירת העמודה וקבלת ה-ID מפיירבייס
				const newId = await addColumn(columnData);

				const newColumn: Column = {
					...columnData,
					id: newId,
				};

				setColumns((prev) => [...prev, newColumn]);
				raiseSnack("success", "עמודה חדשה התווספה בהצלחה");
			} catch (error) {
				raiseSnack("error", "התרחשה שגיאה ביצירת העמודה");
			}
		},
		[raiseSnack],
	);

	// UPDATE
	const handleEditColumn = useCallback(
		async (column: Column) => {
			if (!column.id) return;

			try {
				await updateColumn(column.id, column);
				setColumns((prev) =>
					prev.map((c) => (c.id === column.id ? column : c)),
				);
				raiseSnack("success", "עמודה נערכה בהצלחה");
			} catch (error) {
				raiseSnack("error", "שגיאה בעריכת העמודה");
			}
		},
		[raiseSnack],
	);

	// DELETE
	const handleDeleteColumn = useCallback(
		async (id: string, tasks: Task[]) => {
			try {
				if (tasks.some(task => task.column === id)) {
					raiseSnack("warning", "שים לב! לא ניתן למחוק עמודה שמכילה משימות");
					return;
				}

				await deleteColumn(id);
				setColumns((prev) => prev.filter((c) => c.id !== id));
				raiseSnack("success", "עמודה נמחקה בהצלחה");
			} catch (error) {
				raiseSnack("error", "שגיאה במחיקת העמודה");
			}
		},
		[raiseSnack],
	);

	return {
		columns,
		isLoading,
		handleGetColumns,
		handleAddColumn,
		handleEditColumn,
		handleDeleteColumn,
	};
}

export default useColumns;
