import type { Error, NewTask, Task } from '@/types';
import type { Storage } from '../storage/storage';
import { startIndexDatabase } from '@/composables/indexDB/indexDB';

const indexDbConfig = {
  defaultDatabaseName: 'TasksDatabase',
  defaultTaskObjectStoreName: 'tasks',
};

export function useIndexDB(): Storage<Task, NewTask> {
  async function createTask(newTask: NewTask): Promise<{ error?: Error; data?: Task }> {
    const db = await startIndexDatabase(indexDbConfig.defaultDatabaseName);

    const dbTransaction = db.transaction(indexDbConfig.defaultTaskObjectStoreName, 'readwrite');
    const tasksObjectStore = dbTransaction.objectStore(indexDbConfig.defaultTaskObjectStoreName);

    return new Promise((resolve, reject) => {
      const request = tasksObjectStore.add(newTask);

      request.onerror = function () {
        reject({ error: 'could not add task to database' });
      };

      request.onsuccess = (event) => {
        const taskKeyPath = (event.target as IDBRequest<IDBValidKey>).result;

        resolve({ data: { ...newTask, id: taskKeyPath as number } });
      };
    });
  }

  async function updateTask(
    taskId: number,
    { storeName }: { storeName: string } = { storeName: indexDbConfig.defaultTaskObjectStoreName },
  ): Promise<{ error?: Error; data?: Task }> {
    const db = await startIndexDatabase(indexDbConfig.defaultDatabaseName);

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

        resolve({ data: task });
      };
    });
  }

  async function getTaskById(taskId: number): Promise<{ error?: Error; data?: Task }> {
    const db = await startIndexDatabase(indexDbConfig.defaultDatabaseName);

    const dbTransaction = db.transaction(indexDbConfig.defaultTaskObjectStoreName, 'readonly');
    const tasksObjectStore = dbTransaction.objectStore(indexDbConfig.defaultTaskObjectStoreName);

    const request = tasksObjectStore.get(taskId);

    return new Promise((resolve, reject) => {
      request.onerror = () => {
        reject({ error: { message: 'Could not update task' } });
      };

      request.onsuccess = () => {
        const task: Task = request.result;

        task.isDone = !task.isDone;

        tasksObjectStore.put(task);

        resolve({ data: task });
      };
    });
  }

  async function getTasks(): Promise<{ error?: Error; data?: Task[] }> {
    const db = await startIndexDatabase(indexDbConfig.defaultDatabaseName);

    const dbTransaction = db.transaction(indexDbConfig.defaultTaskObjectStoreName, 'readonly');
    const tasksObjectStore = dbTransaction.objectStore(indexDbConfig.defaultTaskObjectStoreName);

    const request = tasksObjectStore.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = () => {
        reject({ error: { message: 'Could not get tasks' }, tasks: undefined });
      };

      request.onsuccess = (event) => {
        const tasks = (event.target as IDBRequest<Task[]>).result;
        console.log(tasks, request, db);
        resolve({ data: tasks });
      };
    });
  }

  async function deleteTask(taskId: number): Promise<{ error?: Error; data?: Task }> {
    const db = await startIndexDatabase(indexDbConfig.defaultDatabaseName);

    const dbTransaction = db.transaction(indexDbConfig.defaultTaskObjectStoreName, 'readwrite');
    const tasksObjectStore = dbTransaction.objectStore(indexDbConfig.defaultTaskObjectStoreName);

    const taskRequest: IDBRequest<Task> = tasksObjectStore.get(taskId);

    return new Promise((resolve, reject) => {
      taskRequest.onerror = () => {
        reject({ error: { message: 'Error deleting task' } });
      };

      taskRequest.onsuccess = () => {
        tasksObjectStore.delete(taskRequest.result.id);

        resolve({ data: taskRequest.result });
      };
    });
  }

  return {
    store: createTask,
    get: getTaskById,
    getAll: getTasks,
    update: updateTask,
    remove: deleteTask,
  };
}
