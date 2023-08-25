import { uuid } from 'src/common/util/generate.uuid';
import { IAbstractEntity, IBaseEntity } from 'src/types/common/entity.type';

export abstract class AbstractEntity implements IAbstractEntity {
  id: string;

  constructor() {
    this.id = uuid();
  }
}

export class BaseEntity extends AbstractEntity implements IBaseEntity {
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
