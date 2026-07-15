export interface Storage<T> {
  store(): Promise<T>;
  get(id: number): Promise<T>;
  getAll(): Promise<T[]>;
  remove(id: number): Promise<T>;
}
