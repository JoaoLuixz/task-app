export interface Task {
  id: string;
  content: string;
  isDone: boolean;
}
export type NewTask = Omit<Task, 'id'>;

export type TaskFilter = 'done' | 'notDone' | 'all';

export type Error = { message: string };
