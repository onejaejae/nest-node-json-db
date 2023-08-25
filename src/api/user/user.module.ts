import { ClassProvider, Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryKey } from 'src/core/constant/repository.key.constant';
import { UserRepository } from './repository/user.repository';
import { PostModule } from '../post/post.module';

export const userRepository: ClassProvider = {
  provide: UserRepositoryKey,
  useClass: UserRepository,
};

@Module({
  imports: [forwardRef(() => PostModule)],
  providers: [UserService, userRepository],
  controllers: [UserController],
  exports: [userRepository],
})
export class UserModule {}
