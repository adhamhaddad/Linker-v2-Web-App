import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityPropertyNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'something went wrong';
    let errors = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response: any = exception.getResponse();
      switch (status) {
        case 400:
          console.log('response', response);
          errors = response.message;
          message = errors ? 'Bad Request Errors' : response;
          break;
        case 401:
          if (response.message) message = response.message;
          else message = response;
          break;
        case 422:
          errors = response.message;
          message = errors ? 'Validation Errors' : response;
          break;
        default:
          message = exception.getResponse() as string;
          break;
      }
    }

    //typeerror exception
    if (exception instanceof TypeError) {
      message = exception.message;
    }

    //notfound exception,specific for route not found
    if (exception instanceof NotFoundException) {
      const response: any = exception.getResponse();
      message = response.error;
    }

    //database entity property not found exception
    if (exception instanceof EntityPropertyNotFoundError) {
      message = exception.message;
    }

    //QueryFailedError
    if (exception instanceof QueryFailedError) {
      message = exception.message;
    }

    console.error('exception', exception);

    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errors,
    });
  }
}
