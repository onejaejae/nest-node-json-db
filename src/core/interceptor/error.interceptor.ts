import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DataError, DatabaseError } from 'node-json-db';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NodeJsonDBException } from '../exception/node-json-db.exception';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  logger: Logger = new Logger();

  private curryLogger(tag: string) {
    return (data: any) => this.logger.error(tag, data);
  }

  constructor() {}

  private propagateException(err: any, returnObj: Record<string, any>) {
    const { callClass, callMethod } = returnObj;
    switch (err.constructor) {
      case DataError:
        throw new NodeJsonDBException(callClass, callMethod, err);

      case DatabaseError:
        throw new NodeJsonDBException(callClass, callMethod, err);

      default:
        break;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logError = this.curryLogger(
      `${context.getClass().name}.${context.getHandler().name}`,
    );

    return next.handle().pipe(
      catchError((err) => {
        const returnObj: Record<string, any> = {
          message: err.message,
        };

        if (process.env.NODE_ENV !== 'production') {
          returnObj.callClass = context.getClass().name;
          returnObj.callMethod = context.getHandler().name;
          returnObj.stack = err.stack;
        }

        if (err instanceof HttpException) {
          logError(err);

          const payload = err.getResponse();
          context.switchToHttp().getResponse().status(err.getStatus());

          return of({
            ...returnObj,
            ...(typeof payload === 'string' ? { message: payload } : payload),
          });
        }

        logError(err);

        context
          .switchToHttp()
          .getResponse()
          .status(HttpStatus.INTERNAL_SERVER_ERROR);

        this.propagateException(err, returnObj); // propagate error for exception filters

        return of(returnObj);
      }),
    );
  }
}
