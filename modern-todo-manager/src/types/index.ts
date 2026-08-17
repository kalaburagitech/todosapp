export type Priority = "Low" | "Medium" | "High";

export interface Todo {
  _id: string;
  _creationTime: number;
  title: string;
  description?: string;
  dueDate?: number;
  priority: Priority;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}
