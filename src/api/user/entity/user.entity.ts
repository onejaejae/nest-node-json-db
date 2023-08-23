import { BaseEntity } from 'src/core/database/base.entity';

export class User extends BaseEntity {
  email: string;
  password: string;
  refreshToken: string;

  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
  }
}
