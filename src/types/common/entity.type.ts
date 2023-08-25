import { Post } from 'src/api/post/entity/post.entity';
import { User } from 'src/api/user/entity/user.entity';

export const DB_MODULES = [User, Post];
export type Entity = (typeof DB_MODULES)[number];

export interface IAbstractEntity {
  id: string;
}
export interface IBaseEntity extends IAbstractEntity {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
