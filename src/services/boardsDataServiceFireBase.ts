import {
	getFirestore,
	collection,
	addDoc,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
	getDoc,
} from "firebase/firestore";

import app from "../config/firebase";
import type { Board } from "../types/Board";

const db = getFirestore(app);
const boardsCollectionName = "boards";
const boardsCollection = collection(db, boardsCollectionName);

// הוספת לוח
/**
 * מוסיף לוח חדש למסד הנתונים.
 * @param board - אובייקט Board ללא ה-ID.
 * @returns Promise<string> - ה-ID של הלוח שנוצר.
 */
export const addBoard = async (
	board:
		| Omit<Board, "id">
		| { name: string; description: string; color: string, createdAt: number},
): Promise<string> => {
	try {
		const docRef = await addDoc(boardsCollection, board);
		return docRef.id;
	} catch (error) {
		console.error("Error adding board: ", error);
		throw error;
	}
};

// שליפת נתונים מהפיירבייס
/**
 * שולף את כל הלוחות ממסד הנתונים.
 * @returns Promise<Board[]> - מערך של אובייקטי Board.
 */
export const getBoards = async () => {
	const boardsCollection = collection(db, "boards");

	try {
		// 1. שלוף את כל הלוחות ללא שאילתת orderBy (זה יבטיח שגם הישנים יגיעו!)
		const querySnapshot = await getDocs(boardsCollection);

		const boards = querySnapshot.docs.map((doc) => {
			const data = doc.data();

			// 2. השלם את הנתונים החסרים דינמית בזמן הריצה
			return {
				id: doc.id,
				name: data.name || "לוח ללא שם",
				description: data.description || "",
				color: data.color || "#FFFFFF",
				// אם השדה createdAt לא קיים ב-Firebase, נביא ערך דינמי (למשל 0 כדי שהם יהיו ראשונים)
				createdAt: typeof data.createdAt === "number" ? data.createdAt : 0,
			};
		});

		// 3. מיון מהישן ביותר לחדש ביותר
		return boards.sort((a, b) => a.createdAt - b.createdAt);
	} catch (error) {
		console.error("Error getting boards: ", error);
		throw error;
	}
};

/**
 * שולף לוח ספציפי לפי ID.
 * @param id - ה-ID של הלוח לשליפה.
 * @returns Promise<Board | null>
 */
export const getBoardById = async (id: string): Promise<Board | null> => {
	const boardDocRef = doc(db, boardsCollectionName, id);
	try {
		const docSnap = await getDoc(boardDocRef);
		if (docSnap.exists()) {
			// We need to cast the data to Board and add the id
			const boardData = docSnap.data();
			return { id: docSnap.id, ...boardData } as Board;
		} else {
			console.log("No such board document!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching board:", error);
		throw error;
	}
};
// עדכון לוח
/**
 * מעדכן לוח קיים במסד הנתונים.
 * @param id - ה-ID של הלוח לעדכון.
 * @param updatedData - הנתונים החלקיים לעדכון הלוח.
 */
export const updateBoard = async (
	id: string,
	updatedData: Partial<Board>,
): Promise<void> => {
	try {
		const boardDocRef = doc(db, boardsCollectionName, id);
		await updateDoc(boardDocRef, updatedData);
	} catch (error) {
		console.error("Error updating board: ", error);
		throw error;
	}
};

// מחיקת לוח
/**
 * מוחק לוח ממסד הנתונים.
 * @param id - ה-ID של הלוח למחיקה.
 */
export const deleteBoard = async (id: string): Promise<void> => {
	try {
		const boardDocRef = doc(db, boardsCollectionName, id);
		await deleteDoc(boardDocRef);
	} catch (error) {
		console.error("Error deleting board: ", error);
		throw error;
	}
};
