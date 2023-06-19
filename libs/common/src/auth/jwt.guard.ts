import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common'
import {ClientProxy} from '@nestjs/microservices'
import {catchError, map, Observable} from 'rxjs'
import {AUTH_SERVICE} from '@libs/common/constant/microservice'
import {IUserToken} from '@libs/common/types/auth.type'
import {cookieAuthenticationKey} from '@libs/common/auth/constant'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const token = this.getToken(context)

    return this.authClient
      .send('validateUser', {
        [cookieAuthenticationKey]: token,
      })
      .pipe(
        map((user: IUserToken) => {
          this.addUser(user, context)
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
      token = context.switchToRpc().getData()[cookieAuthenticationKey]
    }
    else if (context.getType() === 'http') {
      token = context.switchToHttp().getRequest().cookies?.[cookieAuthenticationKey]
    }

    if (!token) {
      throw new UnauthorizedException(`${cookieAuthenticationKey} cookie not found`)
    }

    return token
  }

  private addUser(user: IUserToken, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user
    }
    else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user
    }
  }
}
