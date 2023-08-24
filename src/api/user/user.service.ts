import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserRepositoryKey } from 'src/core/constant/repository.key.constant';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositoryKey) private readonly userRepository: UserRepository,
  ) {}

  async test() {}
}
