import { Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './repository/post.repository';
import {
  PostRepositoryKey,
  UserRepositoryKey,
} from 'src/core/constant/repository.key.constant';
import { CreatePostDto } from './dto/create.post.dto';
import { Post } from './entity/post.entity';
import { UserRepository } from '../user/repository/user.repository';
import { Transactional } from 'src/core/decorator/transactional.decorator';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepositoryKey) private readonly postRepository: PostRepository,
    @Inject(UserRepositoryKey) private readonly userRepository: UserRepository,
  ) {}

  @Transactional()
  async createPost(createPostDto: CreatePostDto) {
    const { authorId, title, content } = createPostDto;

    await this.userRepository.findByIdOrThrow(authorId);

    const post = new Post(authorId, title, content);
    return this.postRepository.create(post);
  }
}
