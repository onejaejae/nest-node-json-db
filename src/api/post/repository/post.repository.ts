import { BaseRepository } from 'src/core/database/base.repository';
import { Inject, forwardRef } from '@nestjs/common';
import { JsonDBService } from 'src/core/database/database.service';
import { JoinWithUser, Post } from '../entity/post.entity';
import { UserRepositoryKey } from 'src/core/constant/repository.key.constant';
import { UserRepository } from 'src/api/user/repository/user.repository';
import { TransformPlainToInstance } from 'class-transformer';

export class PostRepository extends BaseRepository<Post> {
  getPath(): string {
    return Post.name.toLowerCase().concat('s');
  }

  constructor(
    @Inject(Post.name)
    protected readonly jsonDBService: JsonDBService<Post>,
    @Inject(forwardRef(() => UserRepositoryKey))
    protected readonly userRepository: UserRepository,
  ) {
    super(Post);
  }

  private async findUserByAuthorId(authorId: string) {
    return this.userRepository.findByIdOrThrow(authorId);
  }

  @TransformPlainToInstance(JoinWithUser)
  async joinWithUser(postId: string): Promise<JoinWithUser> {
    const post = (await super.findByIdOrThrow(postId)) as any;
    const user = await this.findUserByAuthorId(post.authorId);

    post.author = user;
    return post;
  }

  async create(item: Post): Promise<void> {
    await this.jsonDBService.jsonDB.push(`/${this.getPath()}[]`, item, true);
  }
}
