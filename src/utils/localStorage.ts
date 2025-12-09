import type { Task } from '@/types'

const DEFAULT_KEY = 'task-list-default-key'

export function saveOnLocalStorage(values: Task[]) {
  localStorage.setItem(DEFAULT_KEY, JSON.stringify(values))
}

export function getFromLocalStorage() {
  const values = localStorage.getItem(DEFAULT_KEY)

  if (values) return JSON.parse(values)
  return []
}
