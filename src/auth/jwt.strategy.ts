import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

interface TokenPayload {
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

  async validate(payload: TokenPayload) {
    return {userId: payload.sub, username: payload.username}
  }
}
