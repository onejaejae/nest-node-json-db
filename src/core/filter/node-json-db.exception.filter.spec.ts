import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { NodeJsonDBExceptionFilter } from './node-json-db.exception.filter';
import { DatabaseError } from 'node-json-db/dist/lib/Errors';
import { NodeJsonDBException } from '../exception/node-json-db.exception';

describe('NodeJsonDBExceptionFilter Test', () => {
  let filter: NodeJsonDBExceptionFilter;

  beforeAll(() => {
    filter = new NodeJsonDBExceptionFilter();
  });

  it('should catch and handle NodeJsonDBException', () => {
    // given
    const err = new DatabaseError('Test Error', 1);
    const exception = new NodeJsonDBException('Test Class', 'Test Method', err);
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    // when
    filter.catch(exception, host);

    // then
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      callClass: exception.callClass,
      callMethod: exception.callMethod,
      message: exception.message,
      stack: exception.stack,
    });
  });
});
