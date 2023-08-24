import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { NodeJsonDBException } from '../exception/node-json-db.exception';

@Catch(NodeJsonDBException)
export class NodeJsonDBExceptionFilter implements ExceptionFilter {
  catch(exception: NodeJsonDBException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let responseStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseJson: Record<string, any> = {
      callClass: exception.callClass,
      callMethod: exception.callMethod,
      message: exception.message,
      stack: exception.stack,
    };

    return response.status(responseStatus).json(responseJson);
  }
}
