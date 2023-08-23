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

  get jsonDB() {
    return this.db;
  }
}
