import {BadRequestException} from '@nestjs/common'
import {Request as ExpressRequest} from 'express'
import {Role} from '@libs/common/role'

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export interface AccessTokenPayload {
  tokenId: string
  userId: number
  username: string
  roles: Role[]
}

export interface RefreshTokenPayload {
  tokenId: string
  userId: number
}

export interface AccessTokenData extends AccessTokenPayload {
  iat: number
  exp: number
}

export interface RefreshTokenData extends RefreshTokenPayload {
  refreshToken: string
  iat: number
  exp: number
}

export interface CacheToken {
  id: string
  userId: number
  accessTokenHash: string
  refreshTokenHash: string
  createdAt: number
  expiresIn: number
}

export interface IVerifyToken {
  token: string
}

export interface IGenerateToken {
  email: string
}

export interface IVerifyTokenResponse {
  iat: number
  exp: number
  email: string
}

export type VerifyEmailToken = IVerifyTokenResponse | BadRequestException

export interface RefreshToken {
  refreshToken: string | null
}

export interface Request extends ExpressRequest {
  user: AccessTokenData
}

export interface RefreshRequest extends ExpressRequest {
  user: RefreshTokenData
}
