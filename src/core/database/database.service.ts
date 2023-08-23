import { Inject, Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { Entity } from 'src/types/common/entity.type';

@Injectable()
export class JsonDBService<T> {
  private db: JsonDB;
  private fileName: string = '';

  constructor(
    @Inject('DB_PATH') private dbPath: { path: string },
    entity: Entity,
  ) {
    this.db = new JsonDB(
      new Config(`${this.dbPath.path}/${entity.name}`, true, true, '/'),
    );
  }

  async getData(key: string): Promise<T> {
    return this.db.getData(key);
  }

  async saveData(key: string, data: T): Promise<void> {
    await this.db.push(`/${key}`, data, true);
    await this.db.save();
  }
}
