import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  async findUserById(@Param('userId') userId: string) {
    return this.userService.findUserById(userId);
  }
}
