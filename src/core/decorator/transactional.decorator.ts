import { SetMetadata, applyDecorators } from '@nestjs/common';

export const TRANSACTIONAL_KEY = Symbol('TRANSACTIONAL');

export function Transactional(): MethodDecorator {
  return applyDecorators(SetMetadata(TRANSACTIONAL_KEY, true));
}
