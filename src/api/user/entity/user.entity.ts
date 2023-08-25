import { Exclude, Type } from 'class-transformer';
import { Post } from 'src/api/post/entity/post.entity';
import { BaseEntity } from 'src/core/database/base.entity';
import { IUser } from 'src/types/user';
import { IGetUserResponse } from 'src/types/user/response/get.user.response';

export class User extends BaseEntity implements IUser {
  email: string;

  @Exclude()
  password: string;

  refreshToken: string;

  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
  }
}

export class JoinWithPosts extends User implements IGetUserResponse {
  @Type(() => Post)
  posts: Post[];
}
