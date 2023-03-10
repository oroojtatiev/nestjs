import {BadRequestException, Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {User} from '../domain/user/user.entity'

interface IVerificationTokenPayload {
  email: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(email: string) {
    const payload: IVerificationTokenPayload = {email}

    return this.jwtService.sign(payload, {
      secret: this.configService.get('AUTH_JWT_SECRET'),
      expiresIn: `${this.configService.get('AUTH_JWT_TOKEN_EXPIRE_SECONDS')}s`,
    })
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('AUTH_JWT_SECRET'),
      })

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email
      }

      throw new BadRequestException()
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired')
      }
      throw new BadRequestException('Bad confirmation token')
    }
  }

  async validatePassword(password: string, user: User) {
    return bcrypt.compare(password, user.password)
  }

  async authorize(user: User): Promise<string> {
    const payload = {
      username: user.email,
      userId: user.id,
      role: user.role,
    }
    return this.jwtService.sign(payload)
  }
}
