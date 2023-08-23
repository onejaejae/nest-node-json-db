import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './api/user/user.module';

const apiModules = [UserModule];
@Module({
  imports: [CoreModule, ...apiModules],
  controllers: [],
  providers: [],
})
export class Modules {}
