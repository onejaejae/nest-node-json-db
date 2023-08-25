import { IPost } from 'src/types/post';
import { IUser } from '..';

export interface IGetUserResponse extends IUser {
  posts: IPost[];
}
