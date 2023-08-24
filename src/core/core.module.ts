import { ClassProvider, Global, Module, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from 'src/api/user/entity/user.entity';
import { Post } from 'src/api/post/entity/post.entity';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
  Reflector,
} from '@nestjs/core';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { NodeJsonDBExceptionFilter } from './filter/node-json-db.exception.filter';
import { TransformInterceptor } from './interceptor/apiResponse.interceptor';
import { TRANSACTIONAL_KEY } from './decorator/transactional.decorator';
import { BaseRepository } from './database/base.repository';
import { JsonDB } from 'node-json-db';

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
    DiscoveryModule,
  ],
  providers: [...interceptors, ...filters],
  exports: [],
})
export class CoreModule implements OnModuleInit {
  constructor(
    private readonly discover: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.transactionalWrap();
  }

  private getRepositories(instance: any): any[] {
    const properties = Object.getOwnPropertyNames(instance);

    return properties
      .map((propertyName) => instance[propertyName])
      .filter((property) => property instanceof BaseRepository);
  }

  transactionalWrap() {
    const instances = this.discover
      .getProviders()
      .filter((v) => v.isDependencyTreeStatic())
      .filter(({ metatype, instance }) => {
        if (!instance || !metatype) return false;
        else return true;
      });

    for (const instance of instances) {
      const names = this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instance.instance),
      );

      for (const name of names) {
        const originalMethod = instance.instance[name];

        const isTransactional = this.reflector.get(
          TRANSACTIONAL_KEY,
          originalMethod,
        );

        if (!isTransactional) {
          continue;
        }

        const repositories = this.getRepositories(instance.instance);

        const jsonDBList: JsonDB[] = repositories.map((repository) => {
          repository.jsonDBService.jsonDB.path = repository.getPath();
          return repository.jsonDBService.jsonDB;
        });

        instance.instance[name] = this.wrapMethod(
          originalMethod,
          instance.instance,
          jsonDBList,
        );
      }
    }
  }

  wrapMethod(originalMethod: any, instance: any, jsonDBList: JsonDB[]) {
    return async function (...args: any[]) {
      // 트랜잭션 시작
      for (const jsonDB of jsonDBList) {
        const path = jsonDB.path;
        const allData = await jsonDB.getObject(`/`);
        const targetData = allData[path] ? allData[path] : [];
        await jsonDB.push('/backup', [...targetData]);
      }

      try {
        const result = await originalMethod.apply(instance, args);
        return result;
      } catch (error) {
        // 트랜잭션 롤백
        for (const jsonDB of jsonDBList) {
          const path = jsonDB.path;
          const allData = await jsonDB.getObject(`/`);
          const targetData = allData[path] ? allData[path] : [];
          const backUpData = (await jsonDB.getObject(`/backup`)) as Array<any>;

          const dataIds: Array<number> = targetData.map((data) => data.id);
          const backupDataIds: Set<number> = new Set(
            backUpData.map((data) => data.id),
          );
          const generatedIds = dataIds.filter((id) => {
            return !backupDataIds.has(id);
          });

          for (const id of generatedIds) {
            const idx = await jsonDB.getIndex(`/${path}`, id);
            await jsonDB.delete(`/${path}[${idx}]`);
          }
        }
        throw error;
      } finally {
        for (const jsonDB of jsonDBList) {
          await jsonDB.delete('/backup');
        }
      }
    };
  }
}
