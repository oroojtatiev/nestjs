import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
import * as Joi from '@hapi/joi'
import {RmqModule} from '@libs/common'
import {SHOP_SERVICE} from '@libs/common/constant/microservice'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {AccessTokenStrategy} from './strategy/AccessToken.strategy'
import {RefreshTokenStrategy} from './strategy/RefreshToken.strategy'

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
    JwtModule.register({}),
    RmqModule.register({name: SHOP_SERVICE}),
  ],
  providers: [AuthService, ConfigService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
