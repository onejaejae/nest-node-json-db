import { IsString } from 'class-validator';
import { createHash } from 'src/common/util/encrypt';

export class SignUpDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  async hashPassword() {
    const hashedPassword = await createHash(this.password);
    return hashedPassword;
  }
}
