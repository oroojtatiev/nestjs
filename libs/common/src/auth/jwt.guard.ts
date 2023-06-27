import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common'
import {ClientProxy} from '@nestjs/microservices'
import {catchError, map, Observable} from 'rxjs'
import {Request} from 'express'
import {AUTH_SERVICE, messagePattern} from '@libs/common/constant/microservice'
import {AccessTokenData} from '@libs/common/types/auth.type'
import {authenticationHeader} from '@libs/common/auth/constant'
import {error} from '@libs/common/constant/message'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const token = this.getToken(context)

    return this.authClient
      .send(messagePattern.auth.verifyAccessToken, {
        [authenticationHeader]: token,
      })
      .pipe(
        map((user: AccessTokenData) => {
          this.addTokenData(user, context)
          return true
        }),
        catchError(() => {
          throw new UnauthorizedException()
        }),
      )
  }

  private getToken(context: ExecutionContext) {
    let token: string

    if (context.getType() === 'rpc') {
      //TODO get token. Can be accessToken and refreshToken
      // token = context.switchToRpc().getData()[authenticationHeader]
    }
    else if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest()
      token = this.extractTokenFromHeader(request)
    }

    if (!token) {
      throw new UnauthorizedException(error.authenticationHeaderNotPassed)
    }

    return token
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  private addTokenData(data: AccessTokenData, context: ExecutionContext) {
    //TODO check for useless
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = data
    }
    else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = data
    }
  }
}
