import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TokenBaseData} from './auth.service'

interface TokenData extends TokenBaseData {
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

  async validate({userId, username, roles}: TokenData) {
    return {userId, username, roles}
  }
}
