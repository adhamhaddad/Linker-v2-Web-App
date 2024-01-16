import { ConfigService } from '@nestjs/config';

export const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    global: true,
    secret: configService.get('JWT.auth_token'),
    signOptions: {
      expiresIn: `${configService.get('JWT.timeout')}d`,
    },
  }),
  inject: [ConfigService],
};
