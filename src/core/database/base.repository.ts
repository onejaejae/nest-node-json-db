import { JsonDBService } from './database.service';

export abstract class BaseRepository<T> {
  protected abstract readonly jsonDBService: JsonDBService<T>;

  constructor() {}

  abstract getPath(): string;

  async getAll(): Promise<T[]> {
    return this.jsonDBService.jsonDB.getObject<T[]>('/');
  }

  async create(data: T): Promise<void> {
    await this.jsonDBService.jsonDB.push(`/${this.getPath()}[]`, data, true);
  }

  async deleteAll(): Promise<void> {
    await this.jsonDBService.jsonDB.delete(`/users[0]`);
  }

  async reload(): Promise<void> {
    await this.jsonDBService.jsonDB.reload();
  }
}
