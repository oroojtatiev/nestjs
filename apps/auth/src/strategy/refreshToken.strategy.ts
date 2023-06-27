import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {ConfigService} from '@nestjs/config'
import {Request} from 'express'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {AccessTokenPayload} from '@libs/common'
import {strategy} from '@libs/common/auth/constant'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, strategy.jwtRefresh) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    })
  }

  validate(request: Request, payload: AccessTokenPayload) {
    const refreshToken = request.get('Authorization').replace('Bearer', '').trim()
    return {...payload, refreshToken}
  }
}
