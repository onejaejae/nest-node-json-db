import { ClassProvider, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryKey } from 'src/core/constant/repository.key.constant';
import { UserRepository } from './repository/user.repository';

export const userRepository: ClassProvider = {
  provide: UserRepositoryKey,
  useClass: UserRepository,
};

@Module({
  imports: [],
  providers: [UserService, userRepository],
  controllers: [UserController],
  exports: [userRepository],
})
export class UserModule {}
