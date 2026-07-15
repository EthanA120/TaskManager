export type Task = {
  id: string;
  column: string;
  title: string;
  description: string;
  userId: string | null;
  savedBy: string[];
  status: "completed" | "pending" | "in-progress";
  dueDate: Date;
  priority: "high" | "medium" | "low";
  likes: number;
  color: string;
};
