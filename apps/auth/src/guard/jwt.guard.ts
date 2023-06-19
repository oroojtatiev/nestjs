import {ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'
import {ClientProxy} from '@nestjs/microservices'
import {JwtService} from '@nestjs/jwt'
import {ConfigService} from '@nestjs/config'
import {lastValueFrom, tap} from 'rxjs'
import {Request} from 'express'
import {cookieAuthenticationKey} from '@libs/common/auth/constant'
import {SHOP_SERVICE} from '@libs/common/constant/microservice'
import {User} from '@libs/common'

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(SHOP_SERVICE) private readonly shopClient: ClientProxy,
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const rmqTransportAuthentication = request.Authentication

    const token = rmqTransportAuthentication ?? this.getCookieToken(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    await this.verifyToken(request, token)
    await this.checkRefreshToken(request.user.sub)

    return true
  }

  private async verifyToken(request: Request, token: string) {
    try {
      request.user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      })
    } catch {
      throw new UnauthorizedException()
    }
  }

  private async checkRefreshToken(userId): Promise<unknown> {
    return lastValueFrom(
      this.shopClient
        .send('getUserById', {id: userId})
        .pipe(
          tap((user: User | null): boolean => {
            if (user && user.refresh_token) {
              return true
            }

            throw new UnauthorizedException()
          })
        )
    )
  }

  private getCookieToken(request: Request): string | undefined {
    return request.cookies[cookieAuthenticationKey]
  }

  private getHeaderToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

