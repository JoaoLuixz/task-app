export interface Task {
  id: string
  content: string
  isDone: boolean
}

export type TaskFilter = 'done' | 'notDone' | 'all'
