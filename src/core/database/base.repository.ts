import { BadRequestException } from '@nestjs/common';
import { JsonDBService } from './database.service';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export abstract class BaseRepository<T> {
  protected abstract readonly jsonDBService: JsonDBService<T>;

  constructor(private readonly classType: ClassConstructor<T>) {}

  abstract getPath(): string;

  private async getIndex(id: string) {
    return this.jsonDBService.jsonDB.getIndex(`/${this.getPath()}`, id);
  }

  async findByIdOrThrow(id: string): Promise<T> {
    const index = await this.getIndex(id);
    if (index < 0) throw new BadRequestException(`id: ${id} don't exist`);

    const res = await this.jsonDBService.jsonDB.getObject<T>(
      `/${this.getPath()}[${index}]`,
    );
    return plainToInstance(this.classType, res);
  }

  // todo
  // find
  async find(): Promise<T[]> {
    return this.jsonDBService.jsonDB.getObject<T[]>('/');
  }

  // todo
  // update
  async findByIdAndUpdate(id: string, item: T) {
    const index = await this.getIndex(id);
    if (index < 0) throw new BadRequestException(`id: ${id} don't exist`);

    await this.jsonDBService.jsonDB.push(
      `/${this.getPath()}[${index}]`,
      item,
      true,
    );
  }

  // todo
  // delete
  async findByIdAndDelte(id: string) {
    const index = await this.getIndex(id);
    if (index < 0) throw new BadRequestException(`id: ${id} don't exist`);

    await this.jsonDBService.jsonDB.delete(`/${this.getPath()}[${index}]`);
  }

  async create(item: T): Promise<void> {
    await this.jsonDBService.jsonDB.push(`/${this.getPath()}[]`, item, true);
  }

  async reload(): Promise<void> {
    await this.jsonDBService.jsonDB.reload();
  }
}
