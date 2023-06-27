import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
import {RedisModule} from '@nestjs-modules/ioredis'
import * as Joi from '@hapi/joi'
import {RmqModule, RedisService} from '@libs/common'
import {SHOP_SERVICE} from '@libs/common/constant/microservice'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {AccessTokenStrategy} from './strategy/accessToken.strategy'
import {RefreshTokenStrategy} from './strategy/refreshToken.strategy'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        APP_PORT_AUTH: Joi.number().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRE: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRE: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_QUEUE_AUTH: Joi.string().required(),
      }),
    }),
    PassportModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          url: configService.get('REDIS_URL'),
        },
      }),
    }),
    JwtModule.register({}),
    RmqModule.register({name: SHOP_SERVICE}),
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, RedisService],
  controllers: [AuthController],
})
export class AuthModule {}
