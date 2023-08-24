import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepositoryKey } from 'src/core/constant/repository.key.constant';
import { UserRepository } from '../user/repository/user.repository';
import { SignUpDto } from './dto/signUp.dto';
import { User } from '../user/entity/user.entity';
import { Transactional } from 'src/core/decorator/transactional.decorator';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepositoryKey) private readonly userRepository: UserRepository,
  ) {}

  @Transactional()
  async signUp(signUpDto: SignUpDto) {
    const { email } = signUpDto;

    const isEmailExist = await this.userRepository.findOne({ email });
    if (isEmailExist)
      throw new BadRequestException(`email ${email} already exist`);

    const hashedPassword = await signUpDto.hashPassword();
    const user = new User(email, hashedPassword);

    return this.userRepository.create(user);
  }
}
