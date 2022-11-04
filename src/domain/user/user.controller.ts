import {
  Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UsePipes,
} from '@nestjs/common'
import {UserRepository} from './user.repository'
import {UserService} from './user.service'
import {AuthService} from '../../auth/auth.service'
import {MailService} from '../../mail/mail.service'
import {prepareData} from '../../functions/date'
import {CreateUserDto, UpdateUserDto, createUserSchema, updateUserSchema} from './user.validation'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'

@Controller('users')
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Get()
  async getList(@Query('offset') offset: number, @Query('limit') limit: number) {
    return this.userService.prepareList(offset, limit)
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const result = await this.userRepository.getOneOrFail(id)

    return prepareData(result)
  }

  @Post('register')
  @UsePipes(new BodyValidatePipe(createUserSchema))
  async create(@Body() body: CreateUserDto) {
    const isEmailExist = await this.userService.checkEmail(body.email)

    if (isEmailExist) {
      throw new HttpException('This email has been already registered', HttpStatus.OK)
    }

    const user = await this.userService.postUser(body)
    const token = await this.authService.generateToken(body.email)

    await this.mailService.sendConfirmation(body.email, token)

    return {
      data: this.userService.prepareUser(user),
      message: 'The confirmation email has been sent',
    }
  }

  @Get('confirm')
  async verifyEmail(@Query('token') token: string) {
    const email = await this.authService.decodeConfirmationToken(token)

    await this.userService.confirmEmail(email)
  }

  @Put(':id')
  @UsePipes(new BodyValidatePipe(updateUserSchema))
  async update(@Param('id') id: number, @Body() data: UpdateUserDto) {
    await this.userRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.userRepository.deleteOrFail(id)

    return {
      message: `Product with ID "${id}" has been deleted`,
    }
  }
}
