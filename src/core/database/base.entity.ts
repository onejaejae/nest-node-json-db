import { uuid } from 'src/common/util/generate.uuid';

export abstract class AbstractEntity {
  id: string;

  constructor() {
    this.id = uuid();
  }
}

export class BaseEntity extends AbstractEntity {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor() {
    super();
    // todo
    // date
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
  }
}
