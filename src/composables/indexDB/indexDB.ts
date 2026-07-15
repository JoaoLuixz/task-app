async function startIndexDatabase(databaseName: string): Promise<IDBDatabase> {
  const request = window.indexedDB.open(databaseName);

  return new Promise((resolve, reject) => {
    request.onerror = () => {
      console.error('Could not open database');
      reject();
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBRequest<IDBDatabase>).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const newDatabase = (event.target as IDBRequest<IDBDatabase>).result;
      newDatabase.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
    };
  });
}

export { startIndexDatabase };
