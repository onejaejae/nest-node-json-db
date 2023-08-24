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

    // await this.userRepository.deleteAll();
    const res = await this.userRepository.find();

    // await this.userRepository.findByIdAndDelte(
    //   '4e5a7f4dc9aded41a2833198c3b95b02',
    // );
    const res22 = await this.userRepository.findByIdOrThrow(
      '46694dc14e969357bd37e17d90a8f7b82',
    );

    // const res333 = await this.userRepository.findOneOrThrow({
    //   email: 'test@email.com2',
    //   id: '4811ec4e58045156986c182ee05470bc',
    // });
    // console.log('res333res333', res333);

    const res44 = await this.userRepository.find({
      email: 'test@email.com',
      id: '46694dc14e969357bd37e17d90a8f7b8',
    });
  }
}
