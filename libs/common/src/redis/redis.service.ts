import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common'
import {InjectRedis, Redis} from '@nestjs-modules/ioredis'
import {JwtService} from '@nestjs/jwt'
import {error} from '@libs/common/constant/message'
import {CacheToken, RefreshTokenData, AccessTokenData, Tokens} from '@libs/common/types/auth.type'
import {compareHash, getHash} from '@libs/common/helper/function/bcrypt'
import {isEmptyObject} from '@libs/common/helper/function/object'

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly cache: Redis,
    private readonly jwtService: JwtService,
  ) {}

  private decodeToken<T>(token: string): T {
    return this.jwtService.decode(token) as T
  }

  private async hGetAll(key: string): Promise<Record<string, string> | CacheToken> {
    const record = await this.cache.hgetall(key)

    if (isEmptyObject(record)) {
      return null
    }

    return record
  }

  async addTokens(accessToken: string, refreshToken: string): Promise<void> {
    const {tokenId, userId, iat, exp} = this.decodeToken<RefreshTokenData>(refreshToken)
    const accessTokenHash = await getHash(accessToken)
    const refreshTokenHash = await getHash(refreshToken)

    try {
      await this.cache.hset(
        `token:${tokenId}`,
        'id', tokenId,
        'userId', userId,
        'accessTokenHash', accessTokenHash,
        'refreshTokenHash', refreshTokenHash,
        'createdAt', iat,
        'expiresIn', exp,
      )
    } catch (e) {
      throw new HttpException(error.tokensAdd, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async verifyAccessTokenExist(token: string): Promise<boolean> {
    const {tokenId} = this.decodeToken<AccessTokenData>(token)
    const record = await this.hGetAll(`token:${tokenId}`)

    if (!record) {
      throw new UnauthorizedException(error.accessTokenNotFound)
    }

    const tokenMatched = compareHash(token, record.accessTokenHash)

    if (!tokenMatched) {
      throw new UnauthorizedException(error.accessTokenNotFound)
    }

    return true
  }

  async verifyRefreshToken(token: string): Promise<string> {
    const {tokenId} = this.decodeToken<RefreshTokenData>(token)
    const record = await this.hGetAll(`token:${tokenId}`)

    if (!record) {
      throw new UnauthorizedException(error.refreshTokenNotFound)
    }

    const tokenMatched = compareHash(token, record.refreshTokenHash)

    if (!tokenMatched) {
      throw new UnauthorizedException(error.refreshTokenNotFound)
    }

    return tokenId
  }

  async updateTokenPair(oldRefreshToken: string, newTokens: Tokens): Promise<void> {
    const {tokenId} = this.decodeToken<RefreshTokenData>(oldRefreshToken)
    await this.addTokens(newTokens.accessToken, newTokens.refreshToken)
    await this.cache.del(`token:${tokenId}`)
  }

  async updateAccessToken(tokenId: string, token: string): Promise<void> {
    const accessTokenHash = await getHash(token)
    await this.cache.hset(`token:${tokenId}`, 'accessTokenHash', accessTokenHash)
  }

  async deleteTokenPair({tokenId}: AccessTokenData): Promise<void> {
    await this.cache.del(`token:${tokenId}`)
  }
}
