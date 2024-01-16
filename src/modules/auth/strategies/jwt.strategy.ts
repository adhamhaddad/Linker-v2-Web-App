import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/jwt.constant';
import { Request } from 'express';
import { Utils } from 'src/utils/utils';
import { Inject } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(Utils)
  private readonly utils: Utils;
  constructor() {
    super({
      secretOrKey: jwtConstants.secret,
      jwtFromRequest: (request: Request) => request.cookies?.access_token,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const {
      cookies: { access_token },
    } = request;

    //get all blacklisted tokens
    const blacklistedTokens = await this.utils.redisGetValue(
      'blacklistedTokens',
    );

    //parsing blacklisted tokens
    const parsedBlacklistedTokens = JSON.parse(blacklistedTokens) || [];

    //check for blacklisted token
    const tokenStatus = parsedBlacklistedTokens.find(
      ({ token }) => token == access_token,
    );
    if (tokenStatus) return false;

    return payload;
  }
}
