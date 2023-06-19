import {BadRequestException} from '@nestjs/common'
import {Role} from '@libs/common/role'

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export interface IUserToken {
  sub: number
  username: string
  roles: Role[]
  refreshToken?: string
}

export interface JwtPayload extends IUserToken {
  iat: number
  exp: number
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

export interface UpdateRefreshToken {
  userId: number
  refreshToken: string | null
}

export type VerifyEmailToken = IVerifyTokenResponse | BadRequestException

export interface RefreshToken {
  refreshToken: string | null
}
