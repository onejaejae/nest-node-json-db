import { ClassProvider, Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from 'src/api/user/entity/user.entity';
import { Post } from 'src/api/post/entity/post.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './interceptor/error.interceptor';

const interceptors: ClassProvider[] = [
  { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
];

@Global()
@Module({
  imports: [
    DatabaseModule.forRoot({ path: './data' }),
    DatabaseModule.forFeature([User, Post]),
  ],
  providers: [...interceptors],
  exports: [],
})
export class CoreModule {}
