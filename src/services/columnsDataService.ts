import type { Column } from "../types/Column";

const columnsLocalStorageKey = "columns";

const getColumns = () => {
  const savedColumns = localStorage.getItem(columnsLocalStorageKey);
  try {
    if (savedColumns) {
      return JSON.parse(savedColumns) as Column[];
    } else {
      return [];
    }
  } catch (e) {
    console.log("saved columns are not valid Json");
    throw new Error("שגיאה בייבוא הנתונים");
  }
};

const editColumns = (newColumns: Column[]) => {
  localStorage.setItem(columnsLocalStorageKey, JSON.stringify(newColumns));
};

export { getColumns, editColumns };
