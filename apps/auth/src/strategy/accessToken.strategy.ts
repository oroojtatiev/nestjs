import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {JwtService} from '@nestjs/jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Request} from 'express'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {AccessTokenData, RedisService} from '@libs/common'
import {authenticationHeader, strategy} from '@libs/common/auth/constant'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, strategy.jwtAccess) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request) => {
        return this.getToken(request)
      }]),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(request: Request, payload: AccessTokenData) {
    const accessToken = this.getToken(request)

    await this.redisService.verifyAccessTokenExist(accessToken)

    return payload
  }

  private getToken(request: Request) {
    const headerToken = request.headers?.authorization.replace('Bearer', '').trim()
    const microserviceToken = request[authenticationHeader]
    return headerToken || microserviceToken
  }
}
