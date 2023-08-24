import { HttpStatus } from '@nestjs/common';
import { GeneralException } from './general.exception';
import { NestedError } from 'node-json-db/dist/lib/Errors';

export class NodeJsonDBException extends GeneralException {
  private readonly _inner: Error;
  private readonly _id: Number;
  private readonly _originalError: NestedError;

  constructor(callClass: string, callMethod: string, err: NestedError) {
    super(
      callClass,
      callMethod,
      err.message,
      err.stack,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    this._inner = err.inner;
    this._id = err.id;
    this._originalError = err;
  }

  get inner() {
    return this._inner;
  }

  get id() {
    return this._id;
  }

  get error() {
    return this._originalError;
  }
}
