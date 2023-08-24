import { ClassProvider, Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from 'src/api/user/entity/user.entity';
import { Post } from 'src/api/post/entity/post.entity';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { NodeJsonDBExceptionFilter } from './filter/node-json-db.exception.filter';
import { TransformInterceptor } from './interceptor/apiResponse.interceptor';

const interceptors: ClassProvider[] = [
  { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
  { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
];
const filters: ClassProvider[] = [
  { provide: APP_FILTER, useClass: NodeJsonDBExceptionFilter },
];

@Global()
@Module({
  imports: [
    DatabaseModule.forRoot({ path: './data' }),
    DatabaseModule.forFeature([User, Post]),
  ],
  providers: [...interceptors, ...filters],
  exports: [],
})
export class CoreModule {}
