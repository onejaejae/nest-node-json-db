import { CallHandler, ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { lastValueFrom, of, throwError } from 'rxjs';
import { TransformInterceptor } from '../apiResponse.interceptor';

describe('ApiResponseInterceptor Test', () => {
  const responseData = { test: 'goood' };

  let interceptor: TransformInterceptor<typeof responseData>;
  let context: ExecutionContext;

  beforeAll(async () => {
    interceptor = new TransformInterceptor();
    context = createMock<ExecutionContext>();
  });

  it('Should be defined', () => {
    //given
    //when
    //then
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should transform response', async () => {
      // given
      const message = 'Test Error';
      const next: CallHandler = {
        handle: () => of(responseData),
      };

      // when
      const transformedResponse = await interceptor.intercept(context, next);

      // then
      const res = await lastValueFrom(transformedResponse);
      expect(res).toEqual({ message: 'success', data: responseData });
    });
  });
});
