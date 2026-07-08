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
import app from "../config/firebase"; // ודא שהנתיב תואם למיקום הקובץ שלך
import type { Task } from "../types/Task";

// אתחול החיבור למסד הנתונים
const db = getFirestore(app);
const tasksCollectionName = "tasks";
const tasksCollection = collection(db, tasksCollectionName);

export const addTask = async (task: Omit<Task, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(tasksCollection, task);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task: ", error);
    throw error;
  }
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const querySnapshot = await getDocs(tasksCollection);
    const tasks: Task[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Task,
    );

    return tasks;
  } catch (error) {
    console.error("Error getting tasks: ", error);
    throw error;
  }
};

export const updateTask = async (
  id: string,
  updatedData: Partial<Task>,
): Promise<void> => {
  try {
    const taskDocRef = doc(db, tasksCollectionName, id);
    await updateDoc(taskDocRef, updatedData);
  } catch (error) {
    console.error("Error updating task: ", error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    const taskDocRef = doc(db, tasksCollectionName, id);
    await deleteDoc(taskDocRef);
  } catch (error) {
    console.error("Error deleting task: ", error);
    throw error;
  }
};

export const getTaskById = async (
  id: string,
): Promise<Task | null | undefined> => {
  // 1. יצירת רפרנס (מצביע) למסמך הספציפי
  const docRef = doc(db, tasksCollectionName, id);

  try {
    // 2. שליפת הנתונים מהשרת (פעולה אסינכרונית)
    const docSnap = await getDoc(docRef);

    // 3. בדיקה האם המסמך אכן קיים במסד הנתונים
    if (docSnap.exists()) {
      return docSnap.data() as Task; // מחזיר את האובייקט כדי שנוכל לעבוד איתו
    } else {
      console.log("No such document!");
      return null; // ה-ID לא נמצא
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};
