import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

interface ValidatePayload {
  username: string
  sub: number
  iat: number
  exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('AUTH_JWT_SECRET'),
    })
  }

  async validate(payload: ValidatePayload) {
    return {userId: payload.sub, username: payload.username}
  }
}
