import { ClassProvider, Module } from '@nestjs/common';
import { PostRepositoryKey } from 'src/core/constant/repository.key.constant';
import { PostRepository } from './repository/post.repository';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserModule } from '../user/user.module';

export const postRepository: ClassProvider = {
  provide: PostRepositoryKey,
  useClass: PostRepository,
};

@Module({
  imports: [UserModule],
  providers: [PostService, postRepository],
  controllers: [PostController],
})
export class PostModule {}
