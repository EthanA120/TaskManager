import {
	getFirestore,
	collection,
	addDoc,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
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

  board: Omit<Board, "id"> | { name: string; description: string; color: string },
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
export const getBoards = async (): Promise<Board[]> => {
  try {
    const querySnapshot = await getDocs(boardsCollection);
    const boards: Board[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Board,
    );
    return boards;
  } catch (error) {
    console.error("Error getting boards: ", error);
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