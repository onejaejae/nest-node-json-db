import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorInterceptor } from '../error.interceptor';
import { createMock } from '@golevelup/ts-jest';
import { lastValueFrom, throwError } from 'rxjs';
import { DataError } from 'node-json-db';
import { NodeJsonDBException } from 'src/core/exception/node-json-db.exception';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let context: ExecutionContext;

  beforeAll(async () => {
    interceptor = new ErrorInterceptor();
    context = createMock<ExecutionContext>();
  });

  it('Should be defined', () => {
    //given
    //when
    //then
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should handle HttpException and return response object', async () => {
      // given
      const message = 'Test Error';
      const next: CallHandler = {
        handle: () => {
          return throwError(
            () => new HttpException(message, HttpStatus.BAD_REQUEST),
          );
        },
      };

      // when
      const resultObservable = interceptor.intercept(context, next);

      // then
      const res = await lastValueFrom(resultObservable);
      expect(res.message).toBe(message);
      expect(res).toHaveProperty('callClass');
      expect(res).toHaveProperty('callMethod');
      expect(res).toHaveProperty('stack');
    });

    it('should handle NestedError and propagate exception', async () => {
      // given
      const message = 'Test DataError';
      const error = new DataError(message, 1);
      const next: CallHandler = {
        handle: () => {
          return throwError(() => error);
        },
      };

      // when
      // then
      await expect(
        lastValueFrom(interceptor.intercept(context, next)),
      ).rejects.toThrowError(
        new NodeJsonDBException(
          context.getClass().name,
          context.getHandler().name,
          error,
        ),
      );
    });
  });
});
