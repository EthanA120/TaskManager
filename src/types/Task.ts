export type Task = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "pending" | "in-progress";
  dueDate: Date;
  priority: "high" | "medium" | "low";
  likes: number;
  column: string;
};
