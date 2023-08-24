import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { PostModule } from './api/post/post.module';

const apiModules = [AuthModule, UserModule, PostModule];
@Module({
  imports: [CoreModule, ...apiModules],
  controllers: [],
  providers: [],
})
export class Modules {}
