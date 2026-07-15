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
import type { Column } from "../types/Column";

// אתחול החיבור למסד הנתונים
const db = getFirestore(app);
const columnsCollectionName = "columns";
const columnsCollection = collection(db, columnsCollectionName);


// הוספת עמודה
export const addColumn = async (
	column: Omit<Column, "id">,
): Promise<string> => {
	try {
		const docRef = await addDoc(columnsCollection, column);
		return docRef.id;
	} catch (error) {
		console.error("Error adding column: ", error);
		throw error;
	}
};

// ייבוא נתונים מהפיירבייס
export const getColumns = async (): Promise<Column[]> => {
	try {
		const querySnapshot = await getDocs(columnsCollection);
		const columns: Column[] = querySnapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data(),
				}) as Column,
		);
		return columns;
	} catch (error) {
		console.error("Error getting columns: ", error);
		throw error;
	}
};

// עדכון
export const updateColumn = async (
	id: string,
	updatedData: Partial<Column>,
): Promise<void> => {
	try {
		const columnDocRef = doc(db, columnsCollectionName, id);
		await updateDoc(columnDocRef, updatedData);
	} catch (error) {
		console.error("Error updating column: ", error);
		throw error;
	}
};

// מחיקה
export const deleteColumn = async (id: string): Promise<void> => {
	try {
		const columnDocRef = doc(db, columnsCollectionName, id);
		await deleteDoc(columnDocRef);
	} catch (error) {
		console.error("Error deleting column: ", error);
		throw error;
	}
};
