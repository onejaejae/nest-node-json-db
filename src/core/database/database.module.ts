import { DynamicModule, Global, Module } from '@nestjs/common';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(path: { path: string }): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DB_PATH',
          useValue: path,
        },
      ],
      exports: ['DB_PATH'],
    };
  }
}
