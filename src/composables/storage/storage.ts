import type { Error } from '@/types';

export interface Storage<T> {
  store(data: T): Promise<Partial<{ error: Error; data: T }>>;
  get(id: number): Promise<Partial<{ error: Error; data: T }>>;
  getAll(): Promise<Partial<{ error: Error; data: T[] }>>;
  update(id: number): Promise<Partial<{ error: Error; data: T }>>;
  remove(id: number): Promise<Partial<{ error: Error; data: T }>>;
}
