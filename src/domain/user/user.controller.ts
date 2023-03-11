import {
  Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, UsePipes,
} from '@nestjs/common'
import {UserRepository} from './user.repository'
import {UserService} from './user.service'
import {AuthService} from '../../auth/auth.service'
import {MailService} from '../../mail/mail.service'
import {CreateUserDto, UpdateUserDto, createUserSchema, updateUserSchema} from './user.validation'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'
import {JwtAuthGuard} from '../../auth/jwt.guard'
import {UserOmit} from '../../type/EntityOmit.type'
import {CreateResponse, DeleteResponse} from '../../type/Response.type'
import {Role} from '../../role/roles.enum'
import {RoleGuard} from '../../role/role.guard'

@Controller('users')
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async getList(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<UserOmit[]> {
    return this.userService.getList(offset, limit)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: number): Promise<UserOmit> {
    return await this.userService.getOne(id)
  }

  @Post('register')
  @UsePipes(new BodyValidatePipe(createUserSchema))
  async create(@Body() body: CreateUserDto): Promise<CreateResponse<UserOmit>> {
    const isEmailExist = await this.userService.checkEmailExist(body.email)

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
  async verifyEmail(@Query('token') token: string): Promise<void> {
    const email = await this.authService.decodeConfirmationToken(token)
    await this.userService.confirmEmail(email)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(updateUserSchema))
  async update(@Param('id') id: number, @Body() data: UpdateUserDto): Promise<UserOmit> {
    await this.userRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async delete(@Param('id') id: number): Promise<DeleteResponse> {
    await this.userRepository.deleteOrFail(id)
    return {
      message: `Product with ID "${id}" has been deleted`,
    }
  }
}
