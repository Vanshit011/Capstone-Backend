import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse()
      .statusCode as number;

    return next.handle().pipe(
      map((data: unknown) => ({
        statusCode,
        message: statusCode >= 400 ? 'Error' : 'Success',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: data as any,
      })),
    );
  }
}
