import { BaseRepository } from 'src/core/database/base.repository';
import { User } from '../entity/user.entity';
import { Inject } from '@nestjs/common';
import { JsonDBService } from 'src/core/database/database.service';

export class UserRepository extends BaseRepository<User> {
  getPath(): string {
    return User.name.toLowerCase().concat('s');
  }
  constructor(
    @Inject(User.name)
    protected readonly jsonDBService: JsonDBService<User>,
  ) {
    super(User);
  }
}
