import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(request: any, response: any, next: () => void) {
    response.on('finish', () => {
      const { ip, method, originalUrl: url, body } = request;
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const hostname = require('os').hostname(); // eslint-disable-line
      const userAgent = request.get('user-agent') || '';
      const referer = request.get('referer') || '';
      this.logger.log(
        `[${hostname}] [${method} ${url}" ${statusCode} ${contentLength}] ["${referer}" "${userAgent}" "${ip}"],[body:${JSON.stringify(
          body,
        )}]`,
      );
    });
    next();
  }
}
