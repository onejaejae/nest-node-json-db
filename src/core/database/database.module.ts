import { DynamicModule, Global, Module, OnModuleInit } from '@nestjs/common';
import { JsonDBService } from './database.service';
import { Entity } from 'src/types/common/entity.type';

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

  static forFeature(entities: Entity[]): DynamicModule {
    const providers = entities.map((value) => ({
      provide: value.name,
      useFactory: (path: { path: string }) => {
        return new JsonDBService<typeof value>(path, value);
      },
      inject: ['DB_PATH'],
    }));

    return {
      module: DatabaseModule,
      providers,
      exports: entities.map((entity) => entity.name),
    };
  }
}
