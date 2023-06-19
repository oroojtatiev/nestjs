import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {Response} from 'express'
import {User} from '@libs/common/entity/user.entity'
import {ROLES_KEY} from '@libs/common/role'
import {IUserToken, Tokens, VerifyEmailToken} from '@libs/common/types/auth.type'
import {cookieAuthenticationKey} from '@libs/common/auth/constant'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateEmailToken(email: string): string {
    return this.jwtService.sign({email}, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
    })
  }

  // TODO remove Exception type from function return
  async verifyEmailToken(token: string): Promise<VerifyEmailToken> {
    try {
      return await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      })
    } catch (error) {
      return new BadRequestException(error.name)
    }
  }

  async validatePassword(password: string, user: User): Promise<boolean> {
    return bcrypt.compare(password, user.password)
  }

  async login(user: User, response: Response): Promise<Tokens> {
    const {accessToken, refreshToken} = await this.getTokens(user)

    const tokenExpire = this.configService.get('JWT_ACCESS_EXPIRE')

    if (!tokenExpire.includes('s')) {
      throw new Error('JWT_ACCESS_EXPIRE must be in seconds. Example: 3600s')
    }

    const expireSeconds = tokenExpire.replace('s', '')

    response.cookie(cookieAuthenticationKey, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + expireSeconds * 1000),
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  async getTokens(user: User): Promise<Tokens> {
    const payload: IUserToken = {
      sub: user.id,
      username: user.email,
      [ROLES_KEY]: user.roles,
    }
    const accessTokenOptions = {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    }
    const refreshTokenOptions = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, accessTokenOptions),
      this.jwtService.signAsync(payload, refreshTokenOptions),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  async validateRefreshToken(userToken: Pick<IUserToken, 'refreshToken'>, user: User): Promise<void> {
    if (!userToken || !userToken.refreshToken) {
      throw new UnauthorizedException()
    }

    const refreshTokenMatches = bcrypt.compare(
      user.refresh_token,
      userToken.refreshToken,
    )

    if (!refreshTokenMatches) {
      throw new UnauthorizedException()
    }
  }

  logout(response: Response): void {
    response.cookie(cookieAuthenticationKey, '', {
      httpOnly: true,
      expires: new Date(),
    })
  }
}
