import type { NewTask, Task } from '@/types';
import type { Storage } from '../storage/storage';

const DEFAULT_KEY = 'task-list-default-key';

export default function useLocalStorage(): Storage<Task, NewTask> {
  function store(data: NewTask): Promise<{ error?: Error; data?: Task }> {
    return new Promise((resolve, reject) => {
      try {
        const currentStored = localStorage.getItem(DEFAULT_KEY);
        let tasks: Task[] = [];

        if (currentStored) {
          tasks = JSON.parse(currentStored);
        }

        const taskId = tasks.reduce(
          (latestId, task) => (task.id >= latestId ? task.id + 1 : latestId),
          0,
        );

        const newTask = { id: taskId, content: data.content, isDone: data.isDone };
        tasks.push(newTask);

        localStorage.setItem(DEFAULT_KEY, JSON.stringify(tasks));
        resolve({ data: newTask });
      } catch (error) {
        reject({ error: error });
      }
    });
  }

  function get(taskId: number): Promise<{ error?: Error; data?: Task }> {
    return new Promise((resolve, reject) => {
      try {
        const currentStored = localStorage.getItem(DEFAULT_KEY);

        if (!currentStored) {
          return reject({ error: 'No tasks found' });
        }

        const tasks: Task[] = JSON.parse(currentStored);

        const desiredTask = tasks.find((task) => task.id === taskId);

        if (!desiredTask) return reject({ error: 'Task not found' });

        resolve({ data: desiredTask });
      } catch (error) {
        reject({ error });
      }
    });
  }

  function getAll(): Promise<{ error?: Error; data: Task[] }> {
    return new Promise((resolve, reject) => {
      try {
        const currentStored = localStorage.getItem(DEFAULT_KEY);

        const tasks: Task[] = [];

        if (currentStored) {
          const currentStoredTasks = JSON.parse(currentStored);

          for (
            let storedTaskIndex = 0;
            storedTaskIndex < currentStoredTasks.length;
            storedTaskIndex++
          ) {
            const storedTask = currentStoredTasks[storedTaskIndex];
            tasks.push(storedTask);
          }
        }

        resolve({ data: tasks });
      } catch (error) {
        reject({ error });
      }
    });
  }

  function update(taskId: number): Promise<{ error?: Error; data?: Task }> {
    return new Promise((resolve, reject) => {
      try {
        const currentStored = localStorage.getItem(DEFAULT_KEY);

        if (!currentStored) {
          return reject({ error: 'No tasks found' });
        }

        const tasks: Task[] = JSON.parse(currentStored);

        const desiredTaskToUpdate = tasks.find((task) => task.id === taskId);

        if (!desiredTaskToUpdate) return reject({ error: 'Task not found' });

        desiredTaskToUpdate.isDone = !desiredTaskToUpdate.isDone;

        localStorage.setItem(DEFAULT_KEY, JSON.stringify(tasks));

        resolve({ data: desiredTaskToUpdate });
      } catch (error) {
        reject({ error });
      }
    });
  }

  function remove(taskId: number): Promise<{ error?: Error; data: Task }> {
    return new Promise((resolve, reject) => {
      try {
        const currentStored = localStorage.getItem(DEFAULT_KEY);

        if (!currentStored) {
          return reject({ error: 'No tasks found' });
        }

        const tasks: Task[] = JSON.parse(currentStored);

        const desiredTaskToRemove = tasks.find((task) => task.id === taskId);

        if (!desiredTaskToRemove) return reject({ error: 'Task not found' });

        tasks.splice(tasks.indexOf(desiredTaskToRemove), 1);

        localStorage.setItem(DEFAULT_KEY, JSON.stringify(tasks));

        resolve({ data: desiredTaskToRemove });
      } catch (error) {
        reject({ error });
      }
    });
  }

  return { store, get, getAll, remove, update };
}
