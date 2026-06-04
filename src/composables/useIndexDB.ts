import config from '@/config/config';
import type { Error, NewTask, Task } from '@/types';
import { startDatabase } from '@/utils/indexDB';

export function useIndexDB(
  { storeName }: { storeName: string } = { storeName: config.defaultTaskObjectStoreName },
) {
  async function addTask(newTask: NewTask): Promise<{ error?: Error; createdTask?: Task }> {
    const db = await startDatabase();

    const dbTransaction = db.transaction(storeName, 'readwrite');
    const tasksObjectStore = dbTransaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = tasksObjectStore.add(newTask);

      request.onerror = function () {
        reject({ error: 'could not add task to database' });
      };

      request.onsuccess = (event) => {
        const taskKeyPath = (event.target as IDBRequest<IDBValidKey>).result;

        resolve({ createdTask: { ...newTask, id: taskKeyPath as number } });
      };
    });
  }

  async function updateTask(
    taskId: number,
    { storeName }: { storeName: string } = { storeName: config.defaultTaskObjectStoreName },
  ): Promise<{ error?: Error; task?: Task }> {
    const db = await startDatabase();

    return new Promise((resolve, reject) => {
      const tasksObjectStore = db.transaction(storeName, 'readwrite').objectStore(storeName);
      const taskObjectStoreRequest = tasksObjectStore.get(taskId);

      taskObjectStoreRequest.onerror = () => {
        reject({ error: { message: 'Could not update task' } });
      };

      taskObjectStoreRequest.onsuccess = () => {
        const task: Task = taskObjectStoreRequest.result;

        task.isDone = !task.isDone;

        tasksObjectStore.put(task);

        resolve({ task });
      };
    });
  }

  async function getTasks(
    { storeName }: { storeName: string } = { storeName: config.defaultTaskObjectStoreName },
  ): Promise<{ error?: Error; tasks: Task[] }> {
    const db = await startDatabase();

    const dbTransaction = db.transaction(storeName, 'readonly');
    const tasksObjectStore = dbTransaction.objectStore(storeName);

    const request = tasksObjectStore.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = () => {
        reject({ error: { message: 'Could not get tasks' }, tasks: undefined });
      };

      request.onsuccess = (event) => {
        const tasks = (event.target as IDBRequest<Task[]>).result;
        resolve({ error: undefined, tasks });
      };
    });
  }

  return { addTask, getTasks, updateTask };
}
