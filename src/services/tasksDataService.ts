import type { Task } from "../types/Task";

const tasksLocalStorageKey = "tasks";

const getTasks = () => {
  const savedTasks = localStorage.getItem(tasksLocalStorageKey);
  try {
    if (savedTasks) {
      return JSON.parse(savedTasks);
    } else {
      return [];
    }
  } catch (e) {
    console.log("saved tasks are not valid Json");
    throw new Error("שגיאה בייבוא הנתונים");
  }
};

const editTasks = (newTasks: Task[]) => {
  localStorage.setItem(tasksLocalStorageKey, JSON.stringify(newTasks));
};

export { getTasks, editTasks };
