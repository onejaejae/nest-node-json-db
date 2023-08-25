import { BaseRepository } from 'src/core/database/base.repository';
import { JoinWithPosts, User } from '../entity/user.entity';
import { Inject } from '@nestjs/common';
import { JsonDBService } from 'src/core/database/database.service';
import { Post } from 'src/api/post/entity/post.entity';
import { IGetUserResponse } from 'src/types/user/response/get.user.response';
import { TransformPlainToInstance } from 'class-transformer';

export class UserRepository extends BaseRepository<User> {
  getPath(): string {
    return User.name.toLowerCase().concat('s');
  }

  constructor(
    @Inject(User.name)
    protected readonly jsonDBService: JsonDBService<User>,
    @Inject(Post.name)
    protected readonly postJsonDBService: JsonDBService<Post>,
  ) {
    super(User);
  }

  private async findPostsByUserId(userId: string) {
    const posts = await this.postJsonDBService.jsonDB.getObject<Post[]>(
      `/${Post.name.toLowerCase().concat('s')}`,
    );

    return posts.filter((item) => item.authorId === userId);
  }

  @TransformPlainToInstance(JoinWithPosts)
  async joinWithPosts(userId: string): Promise<IGetUserResponse> {
    const user = (await this.findByIdOrThrow(userId)) as any;
    const post = await this.findPostsByUserId(userId);

    user.posts = post;
    return user;
  }
}
