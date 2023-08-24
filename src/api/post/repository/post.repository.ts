import { BaseRepository } from 'src/core/database/base.repository';
import { Inject } from '@nestjs/common';
import { JsonDBService } from 'src/core/database/database.service';
import { Post } from '../entity/post.entity';

export class PostRepository extends BaseRepository<Post> {
  getPath(): string {
    return Post.name.toLowerCase().concat('s');
  }

  constructor(
    @Inject(Post.name)
    protected readonly jsonDBService: JsonDBService<Post>,
  ) {
    super(Post);
  }

  async create(item: Post): Promise<void> {
    await this.jsonDBService.jsonDB.push(`/${this.getPath()}[]`, item, true);
  }
}
