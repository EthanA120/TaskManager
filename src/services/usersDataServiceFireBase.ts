import { getFirestore, collection, setDoc, getDocs, getDoc, doc } from "firebase/firestore";
import app from "../config/firebase";
import {type User } from "../types/User";



const db = getFirestore(app);
const usersCollection = collection(db, "users");

export async function getUsers(): Promise<User[]> {
  try {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const docRef = doc(db, "users", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<User, "id">),
    };
  } catch (error) {
    console.error("Error getting user by id:", error);
    throw error;
  }
}

export async function addUser(user: User): Promise<string> {
  try {
    // יצירת רפרנס למסמך בקולקשן users עם ה-ID של המשתמש
    const userDocRef = doc(usersCollection, user.id);
    
    // שמירת המסמך ב-Firestore
    await setDoc(userDocRef, user);
    
    // החזרת ה-ID כפי שהפונקציה המקורית עשתה
    return user.id;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}