import { Inject, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserRepositoryKey } from 'src/core/constant/repository.key.constant';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositoryKey) private readonly userRepository: UserRepository,
  ) {}

  async test() {
    // const user = new User('test@email.com', '1234');
    // this.userRepository.create(user);

    // const user2 = new User('test22@email.com', '1234');
    // this.userRepository.create(user2);

    // const user3 = new User('test@email.com', '1234');
    // this.userRepository.create(user3);

    await this.userRepository.deleteAll();
    const result = await this.userRepository.getAll();
    await this.userRepository.reload();
    console.log('resultresult', result);
  }
}
