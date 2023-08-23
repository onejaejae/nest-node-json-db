import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:postId')
  async findPostById() {}
}
