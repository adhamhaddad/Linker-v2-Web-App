import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ERROR_CODES } from '../constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly auth_token: string;

  constructor(private readonly configService: ConfigService) {
    this.auth_token = configService.get('JWT.auth_token');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res
        .status(ERROR_CODES.AUTH_TOKEN_NOT_FOUND.code)
        .send(ERROR_CODES.AUTH_TOKEN_NOT_FOUND);
      return;
    }
    const tokens = req.headers.authorization
      .replace(/^\s+|\s+$/g, '')
      .split(' ');
    if (
      !(
        tokens &&
        tokens.length > 0 &&
        tokens[0].toLowerCase() === 'bearer' &&
        tokens[1] &&
        tokens[1] !== 'null'
      )
    ) {
      res
        .status(ERROR_CODES.AUTH_TOKEN_NOT_FOUND.code)
        .send(ERROR_CODES.AUTH_TOKEN_NOT_FOUND);
      return;
    }
    try {
      const resp = (await verify(tokens[1], this.auth_token)) as any;
      res.locals.USER_DATA = resp;
      next();
    } catch (err) {
      res
        .status(ERROR_CODES.UNAUTHORIZED_ACCESS.code)
        .send(ERROR_CODES.UNAUTHORIZED_ACCESS);
    }
  }
}
