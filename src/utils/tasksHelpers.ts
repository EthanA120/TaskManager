import type { Column } from "../types/Column";
import type { Task } from "../types/Task";

export const getColumnName = (columnId: string, columns: Column[]) => {
  return columns.find((c) => c.id === columnId)?.name ?? columnId;
};

// פונקציות עזר לקביעת צבעים לפי סטטוס ועדיפות
export const getStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "success";
    case "in-progress":
      return "warning";
    default:
      return "secondary";
  }
};

export const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "info";

    default:
      return "default";
  }
};

export const getHebrewStatus = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "הושלם";
    case "in-progress":
      return "בתהליך";
    case "pending":
      return "ממתין";
    default:
      return status;
  }
};

export const getHebrewPriority = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "גבוהה";
    case "medium":
      return "בינונית";
    case "low":
      return "נמוכה";
    default:
      return priority;
  }
};
