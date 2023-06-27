import {BadRequestException, Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {JwtService} from '@nestjs/jwt'
import {JwtSignOptions} from '@nestjs/jwt/dist/interfaces'
import {Response} from 'express'
import {uid} from 'uid'
import {AccessTokenData, RefreshTokenData} from '@libs/common'
import {User} from '@libs/common/entity/user.entity'
import {ROLES_KEY} from '@libs/common/role'
import {tokenIdLength} from '@libs/common/config'
import {cookie} from '@libs/common/auth/constant'
import {AccessTokenPayload, RefreshTokenPayload, Tokens, VerifyEmailToken} from '@libs/common/types/auth.type'
import {compareHash} from '@libs/common/helper/function/bcrypt'
import {getCurrentUnixInSeconds} from '@libs/common/helper/function/date'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateEmailToken(email: string): Promise<string> {
    const options = {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
    }
    return await this.jwtService.signAsync({email}, options)
  }

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
    return compareHash(password, user.password)
  }

  async getNewAccessToken(user: User, tokenId?: string): Promise<string> {
    if (!tokenId) tokenId = uid(tokenIdLength)

    const tokenPayload: AccessTokenPayload = {
      tokenId,
      userId: user.id,
      username: user.email,
      [ROLES_KEY]: user.roles,
    }

    const tokenOptions: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    }

    return await this.jwtService.signAsync(tokenPayload, tokenOptions)
  }

  async getNewRefreshToken(user: User, tokenId: string): Promise<string> {
    const tokenPayload: RefreshTokenPayload = {
      tokenId,
      userId: user.id,
    }

    const tokenOptions = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    }

    return await this.jwtService.signAsync(tokenPayload, tokenOptions)
  }

  async getNewTokenPair(user: User): Promise<Tokens> {
    const tokenId = uid(tokenIdLength)

    const [refreshToken, accessToken] = await Promise.all([
      this.getNewRefreshToken(user, tokenId),
      this.getNewAccessToken(user, tokenId),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async login(user: User, response: Response): Promise<Tokens> {
    const {accessToken, refreshToken} = await this.getNewTokenPair(user)

    let refreshTokenExpire = this.configService.get('JWT_REFRESH_EXPIRE')

    if (!refreshTokenExpire.includes('s')) {
      throw new Error('JWT_REFRESH_EXPIRE must be in seconds. Example: 3600s')
    }

    const refreshTokenExpireSeconds = refreshTokenExpire.replace('s', '')

    refreshTokenExpire = new Date(Date.now() + refreshTokenExpireSeconds * 1000)

    response.cookie(cookie.refreshToken, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: refreshTokenExpire,
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    const {exp} = this.jwtService.decode(token) as AccessTokenData | RefreshTokenData
    const currentTime = getCurrentUnixInSeconds()
    return exp < currentTime
  }
}
