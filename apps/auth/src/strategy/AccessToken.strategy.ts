import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Request} from 'express'
import {JwtPayload} from '@libs/common/types/auth.type'
import {cookieAuthenticationKey} from '@libs/common/auth/constant'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.[cookieAuthenticationKey],
      ]),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    return payload
  }
}
