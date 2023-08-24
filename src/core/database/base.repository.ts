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

  async find(filter?: Partial<T>): Promise<T[]> {
    const items = await this.jsonDBService.jsonDB.getObject<T[]>(
      `//${this.getPath()}`,
    );

    if (filter) {
      const filteredItems = items.filter((item) => {
        for (const key in filter) {
          if (item[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      });
      return filteredItems;
    }

    return items;
  }

  async findOneOrThrow(filter: Partial<T>): Promise<T> {
    const items = await this.find();

    const foundItem = items.find((item) => {
      for (const key in filter) {
        if (item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });

    if (!foundItem) throw new BadRequestException('target does not exist');
    return foundItem;
  }

  async findByIdAndUpdate(id: string, item: T) {
    const index = await this.getIndex(id);
    if (index < 0) throw new BadRequestException(`id: ${id} don't exist`);

    await this.jsonDBService.jsonDB.push(
      `/${this.getPath()}[${index}]`,
      item,
      true,
    );
  }

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
