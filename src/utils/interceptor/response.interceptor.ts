import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const { data = null, message, total = 0, meta = {} } = response;
        return {
          status: context.switchToHttp().getResponse().statusCode,
          message,
          data,
          total,
          meta,
        };
      }),
    );
  }
}
