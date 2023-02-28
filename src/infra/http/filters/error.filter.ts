import { NotFoundError, ServerError } from '@/domain/errors';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ServerError)
export class ServerErrorFilter implements ExceptionFilter {
  catch(exception: ServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: HttpStatus;

    if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
    } else {
      status = HttpStatus.BAD_REQUEST;
    }

    return response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
