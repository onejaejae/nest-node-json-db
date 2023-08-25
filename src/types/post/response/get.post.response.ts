import { IPost } from 'src/types/post';
import { IUser } from 'src/types/user';

export interface IGetPostResponse extends IPost {
  author: IUser;
}
