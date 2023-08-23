import { Post } from 'src/api/post/entity/post.entity';
import { User } from 'src/api/user/entity/user.entity';

export const DB_MODULES = [User, Post];
export type Entity = (typeof DB_MODULES)[number];
