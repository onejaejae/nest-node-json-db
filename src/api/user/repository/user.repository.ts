import { BaseRepository } from 'src/core/database/base.repository';
import { JoinWithPosts, User } from '../entity/user.entity';
import { Inject, forwardRef } from '@nestjs/common';
import { JsonDBService } from 'src/core/database/database.service';
import { TransformPlainToInstance } from 'class-transformer';
import { PostRepositoryKey } from 'src/core/constant/repository.key.constant';
import { PostRepository } from 'src/api/post/repository/post.repository';

export class UserRepository extends BaseRepository<User> {
  getPath(): string {
    return User.name.toLowerCase().concat('s');
  }

  constructor(
    @Inject(User.name)
    protected readonly jsonDBService: JsonDBService<User>,
    @Inject(forwardRef(() => PostRepositoryKey))
    protected readonly postRepository: PostRepository,
  ) {
    super(User);
  }

  private async findPostsByUserId(userId: string) {
    return this.postRepository.find({ authorId: userId });
  }

  @TransformPlainToInstance(JoinWithPosts)
  async joinWithPosts(userId: string): Promise<JoinWithPosts> {
    const user = (await this.findByIdOrThrow(userId)) as any;
    const post = await this.findPostsByUserId(userId);

    user.posts = post;
    return user;
  }
}
