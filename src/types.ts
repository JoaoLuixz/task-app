export interface Task {
  id: number;
  content: string;
  isDone: boolean;
}
export type NewTask = Omit<Task, 'id'>;

export type TaskFilter = 'done' | 'notDone' | 'all';

export type Error = { message: string };
