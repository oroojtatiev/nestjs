import {
  Body, Controller, Get, Inject, NotAcceptableException, Post, Req, Res, UnauthorizedException, UseGuards, UsePipes,
} from '@nestjs/common'
import {ClientProxy, MessagePattern, Payload} from '@nestjs/microservices'
import {Response} from 'express'
import {mergeMap, Observable} from 'rxjs'
import {User, RefreshRequest} from '@libs/common'
import {BodyValidatePipe} from '@libs/common/helper'
import {messagePattern, SHOP_SERVICE} from '@libs/common/constant/microservice'
import {UserToken} from '@libs/common/helper/decorator/user.decorator'
import {
  IVerifyToken, IGenerateToken, Tokens, VerifyEmailToken, RefreshToken, AccessTokenData,
} from '@libs/common/types/auth.type'
import {MessageResponse} from '@libs/common/types/response.type'
import {RedisService} from '@libs/common/redis/redis.service'
import {cookie} from '@libs/common/auth/constant'
import {LoginDto, loginSchema} from './auth.validation'
import {AuthService} from './auth.service'
import {RefreshTokenGuard} from './guard/refreshToken.guard'
import {AccessTokenGuard} from './guard/accessToken.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private redisService: RedisService,
    @Inject(SHOP_SERVICE) private shopClient: ClientProxy,
  ) {}

  @Post('login')
  @UsePipes(new BodyValidatePipe(loginSchema))
  async login(
    @Body() body: LoginDto,
    @Res({passthrough: true}) response: Response
  ): Promise<Observable<Tokens>> {
    return this.shopClient
      .send(messagePattern.shop.getUserByEmail, {email: body.email})
      .pipe(
        mergeMap(async (user: User | null) => {
          if (!user) {
            throw new NotAcceptableException('Could not find the user')
          }

          if (!user.is_email_verified) {
            throw new UnauthorizedException('Email is not verified')
          }

          const isValidPassword = await this.authService.validatePassword(body.password, user)

          if (!isValidPassword) {
            throw new UnauthorizedException({message: 'Email or password is not correct'})
          }

          const {accessToken, refreshToken} = await this.authService.login(user, response)

          await this.redisService.addTokens(accessToken, refreshToken)

          return {
            accessToken,
            refreshToken,
          }
        }),
      )
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Req() req: RefreshRequest): Promise<Observable<RefreshToken>> {
    const {userId, refreshToken} = req.user

    return this.shopClient
      .send(messagePattern.shop.getUserById, {id: userId})
      .pipe(
        mergeMap(async (user: User) => {
          let tokens

          const tokenId = await this.redisService.verifyRefreshToken(refreshToken)

          const refreshTokenExpired = await this.authService.isTokenExpired(refreshToken)

          if (refreshTokenExpired) {
            tokens = await this.authService.getNewTokenPair(user)
            await this.redisService.updateTokenPair(req.user.refreshToken, tokens)
          }
          else {
            const accessToken = await this.authService.getNewAccessToken(user)
            await this.redisService.updateAccessToken(tokenId, accessToken)

            tokens = {
              accessToken,
              refreshToken,
            }
          }

          return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          }
        }),
      )
  }

  @Get('logout')
  @UseGuards(AccessTokenGuard)
  async logout(
    @UserToken() tokenData: AccessTokenData,
    @Res({passthrough: true}) response: Response,
  ): Promise<MessageResponse> {
    await this.redisService.deleteTokenPair(tokenData)

    response.cookie(cookie.refreshToken, '', {
      httpOnly: true,
      expires: new Date(),
    })

    return {
      message: 'Successfully logged out',
    }
  }

  @MessagePattern(messagePattern.auth.verifyAccessToken)
  @UseGuards(AccessTokenGuard)
  async verifyAccessTokenFromService(@UserToken() tokenData: AccessTokenData): Promise<AccessTokenData> {
    return tokenData
  }

  @MessagePattern(messagePattern.auth.generateEmailToken)
  async generateEmailToken(@Payload() {email}: IGenerateToken): Promise<string> {
    return this.authService.generateEmailToken(email)
  }

  //TODO Investigate: Can microservice have exception return?
  @MessagePattern(messagePattern.auth.verifyEmailToken)
  async verifyEmailToken({token}: IVerifyToken): Promise<VerifyEmailToken> {
    return this.authService.verifyEmailToken(token)
  }
}
