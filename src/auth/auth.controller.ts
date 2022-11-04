import {
  Body, Controller, Get, NotAcceptableException, Post, Query, UnauthorizedException, UsePipes,
} from '@nestjs/common'
import {UserService} from '../domain/user/user.service'
import {AuthService} from './auth.service'
import {BodyValidatePipe, QueryValidatePipe} from '../infrastructure/pipes/validation.pipe'
import {LoginDto, loginSchema} from './auth.validation'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('confirm')
  async verifyEmail(@Query(new QueryValidatePipe(['token'])) token: string) {
    const email = await this.authService.decodeConfirmationToken(token)

    await this.userService.confirmEmail(email)

    return {
      message: 'Email has been successfully confirmed',
    }
  }

  @Post('login')
  @UsePipes(new BodyValidatePipe(loginSchema))
  async login(@Body() body: LoginDto) {
    const user = await this.userService.getUser(body.email)

    if (!user) {
      throw new NotAcceptableException('Could not find the user')
    }

    const isValidPassword = await this.authService.validatePassword(body.password, user)

    if (isValidPassword) {
      return await this.authService.authorize(user)
    } else {
      throw new UnauthorizedException({message: 'Email or password is not correct'})
    }
  }
}
