import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Lang = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;
    let lang = headers['localization'];

    if (!(lang && ['en', 'ar'].includes(lang))) {
      lang = 'en';
    }
    return lang.toLowerCase();
  },
);
