import { BadRequestException } from '@nestjs/common';
import { JsonDBService } from './database.service';

export abstract class BaseRepository<T> {
  protected abstract readonly jsonDBService: JsonDBService<T>;

  constructor() {}

  abstract getPath(): string;

  private async getIndex(id: string) {
    return this.jsonDBService.jsonDB.getIndex(`/${this.getPath()}`, id);
  }

  async findByIdOrThrow(id: string): Promise<T[]> {
    const index = await this.getIndex(id);
    if (index < 0) throw new BadRequestException(`id: ${id} don't exist`);

    return this.jsonDBService.jsonDB.getObject<T[]>(
      `/${this.getPath()}[${index}]`,
    );
  }

  async getAll(): Promise<T[]> {
    return this.jsonDBService.jsonDB.getObject<T[]>('/');
  }

  async create(data: T): Promise<void> {
    await this.jsonDBService.jsonDB.push(`/${this.getPath()}[]`, data, true);
  }

  async deleteAll(): Promise<void> {
    await this.jsonDBService.jsonDB.delete(`/users`);
  }

  async reload(): Promise<void> {
    await this.jsonDBService.jsonDB.reload();
  }
}
