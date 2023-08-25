import { IBaseEntity } from '../common/entity.type';

export interface IPost extends IBaseEntity {
  authorId: string;
  title: string;
  content: string;
}
