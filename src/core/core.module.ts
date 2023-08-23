import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from 'src/api/user/entity/user.entity';
import { Post } from 'src/api/post/entity/post.entity';

@Global()
@Module({
  imports: [
    DatabaseModule.forRoot({ path: './data' }),
    DatabaseModule.forFeature([User, Post]),
  ],
  providers: [],
  exports: [],
})
export class CoreModule {}
