import {
  Body, Controller, Get, Inject, NotAcceptableException, Post, Req, Res, UnauthorizedException, UseGuards, UsePipes,
} from '@nestjs/common'
import {ClientProxy, MessagePattern, Payload} from '@nestjs/microservices'
import {Request, Response} from 'express'
import {map, mergeMap, Observable} from 'rxjs'
import {User} from '@libs/common'
import {BodyValidatePipe} from '@libs/common/helper'
import {SHOP_SERVICE} from '@libs/common/constant/microservice'
import {UserToken} from '@libs/common/helper/decorator/user.decorator'
import {
  IVerifyToken, IUserToken, IGenerateToken, Tokens, VerifyEmailToken, RefreshToken,
} from '@libs/common/types/auth.type'
import {MessageResponse} from '@libs/common/types/response.type'
import {LoginDto, loginSchema} from './auth.validation'
import {AuthService} from './auth.service'
import {RefreshTokenGuard} from './guard/refreshToken.guard'
import {AuthJwtGuard} from './guard/jwt.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(SHOP_SERVICE) private shopClient: ClientProxy,
  ) {}

  @Post('login')
  @UsePipes(new BodyValidatePipe(loginSchema))
  async login(
    @Body() body: LoginDto,
    @Res({passthrough: true}) response: Response
  ): Promise<Observable<Tokens>> {
    return this.shopClient
      .send('getUserByEmail', {email: body.email})
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

          return {userId: user.id, accessToken, refreshToken}
        }),
        mergeMap(({userId, accessToken, refreshToken}) => {
          return this.shopClient
            .send('updateUserRefreshToken', {
              userId,
              refreshToken,
            })
            .pipe(
              map((refreshToken: string) => {
                return {accessToken, refreshToken}
              })
            )
        }),
      )
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Req() req: Request): Promise<Observable<RefreshToken>> {
    const userId = req.user.sub

    return this.shopClient
      .send('getUserById', {id: userId})
      .pipe(
        mergeMap(async (user: User) => {
          await this.authService.validateRefreshToken(req.user, user)
          const {accessToken, refreshToken} = await this.authService.getTokens(user)
          return {accessToken, refreshToken}
        }),
        mergeMap(({accessToken, refreshToken}: Tokens) => {
          return this.shopClient
            .send('updateUserRefreshToken', {userId, refreshToken})
            .pipe(
              map(() => ({
                accessToken,
                refreshToken,
              }))
            )
        })
      )
  }

  @Get('logout')
  @UseGuards(AuthJwtGuard)
  async logout(
    @UserToken() user: IUserToken,
    @Res({passthrough: true}) res: Response,
  ): Promise<Observable<MessageResponse>> {
    return this.shopClient
      .send('updateUserRefreshToken', {userId: user.sub, refreshToken: null})
      .pipe(
        map(() => {
          this.authService.logout(res)
          return {
            message: 'Successfully logged out',
          }
        }),
      )
  }

  @MessagePattern('validateUser')
  @UseGuards(AuthJwtGuard)
  async validateUser(@UserToken() user: IUserToken): Promise<IUserToken> {
    return user
  }

  @MessagePattern('generateEmailToken')
  generateEmailToken(@Payload() {email}: IGenerateToken): string {
    return this.authService.generateEmailToken(email)
  }

  @MessagePattern('verifyEmailToken')
  async verifyEmailToken({token}: IVerifyToken): Promise<VerifyEmailToken> {
    return this.authService.verifyEmailToken(token)
  }
}
