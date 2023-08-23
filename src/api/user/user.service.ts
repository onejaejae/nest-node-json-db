import { Inject, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { JsonDBService } from 'src/core/database/database.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(User.name)
    private readonly userJsonDBService: JsonDBService<User>,
  ) {}

  test() {
    const user = new User('test@email.com', '1234');
    this.userJsonDBService.saveData('user[]/', user);

    this.userJsonDBService.getData('user[]/').then((data) => {
      console.log(data);
    });
  }
}
