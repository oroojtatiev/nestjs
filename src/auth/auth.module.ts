import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
import {UserModule} from '../domain/user/user.module'
import {AuthService} from './auth.service'
import {AuthController} from './auth.controller'
import {UserService} from '../domain/user/user.service'
import {UserRepository} from '../domain/user/user.repository'
import {MailService} from '../mail/mail.service'
import {JwtStrategy} from './jwt.strategy'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.AUTH_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRE_SECONDS + 's',
      },
    }),
  ],
  providers: [UserService, UserRepository, AuthService, ConfigService, MailService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
