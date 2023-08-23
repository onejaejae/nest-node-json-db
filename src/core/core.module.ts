import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

@Global()
@Module({
  imports: [DatabaseModule.forRoot({ path: './data' })],
  providers: [],
  exports: [],
})
export class CoreModule {}
