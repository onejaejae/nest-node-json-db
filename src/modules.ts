import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';

const apiModules = [UserModule, AuthModule];
@Module({
  imports: [CoreModule, ...apiModules],
  controllers: [],
  providers: [],
})
export class Modules {}
