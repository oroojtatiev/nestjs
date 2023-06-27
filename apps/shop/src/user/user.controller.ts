import {
  Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Query, UseGuards, UsePipes,
  BadRequestException,
} from '@nestjs/common'
import {ClientProxy, MessagePattern} from '@nestjs/microservices'
import {map, mergeMap, Observable} from 'rxjs'
import {JwtGuard, User} from '@libs/common'
import {BodyValidatePipe} from '@libs/common/helper'
import {Role, RoleGuard} from '@libs/common/role'
import {GetUserByEmail} from '@libs/common/types/user.type'
import {UserOmit} from '@libs/common/types/entityOmit.type'
import {AUTH_SERVICE, MAIL_SERVICE, messagePattern} from '@libs/common/constant/microservice'
import {CreateResponse, MessageResponse} from '@libs/common/types/response.type'
import {IVerifyTokenResponse} from '@libs/common/types/auth.type'
import {UserToken} from '@libs/common/helper/decorator/user.decorator'
import {
  CreateUserDto, createUserSchema, UpdateUserByUserDto, updateUserByUserSchema, UpdateUserByAdminDto,
  updateUserByAdminSchema,
} from './user.validation'
import {UserRepository} from './user.repository'
import {UserService} from './user.service'

@Controller('user')
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    @Inject(MAIL_SERVICE) private mailClient: ClientProxy,
  ) {}

  @Post('register')
  @UsePipes(new BodyValidatePipe(createUserSchema))
  async create(@Body() body: CreateUserDto): Promise<Observable<CreateResponse<UserOmit>>> {
    const isEmailExist = await this.userService.checkEmailExist(body.email)

    if (isEmailExist) {
      throw new HttpException('This email has been already registered', HttpStatus.BAD_REQUEST)
    }

    const user: User = await this.userService.save(body)

    return this.authClient
      .send(messagePattern.auth.generateEmailToken, {email: body.email})
      .pipe(
        mergeMap((token: string) => {
          return this.mailClient
            .send(messagePattern.mail.sendConfirmation, {
              email: body.email,
              token,
            })
            .pipe(
              map(() => ({
                data: this.userService.prepareUser(user),
                message: 'The confirmation email has been sent',
              }))
            )
        }),
      )
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authClient
      .send(messagePattern.auth.verifyEmailToken, {token})
      .pipe(
        mergeMap(async (response: IVerifyTokenResponse | BadRequestException) => {
          if ('email' in response) {
            await this.userRepository.verifyEmail(response.email)

            return {
              message: 'Email has been successfully confirmed',
            }
          }
          else {
            if (response.message === 'TokenExpiredError') {
              throw new BadRequestException('Confirmation token is expired')
            }
            throw new BadRequestException('Confirmation token is invalid')
          }
        }),
      )
  }

  @Get()
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  async getList(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<UserOmit[]> {
    return this.userService.getList(offset, limit)
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getOneById(@Param('id') id: number): Promise<UserOmit> {
    return this.userService.getOne(id)
  }

  @Put()
  @UseGuards(JwtGuard)
  @UsePipes(new BodyValidatePipe(updateUserByUserSchema))
  async updateByUser(
    @Body() data: UpdateUserByUserDto,
    @UserToken() user,
  ): Promise<UserOmit> {
    await this.userRepository.update(user.userId, data)
    return await this.getOneById(user.userId)
  }

  @Put(':id')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  @UsePipes(new BodyValidatePipe(updateUserByAdminSchema))
  async updateByAdmin(
    @Param('id') id: number,
    @Body() data: UpdateUserByAdminDto,
  ): Promise<UserOmit> {
    await this.userRepository.update(id, data)
    return await this.getOneById(id)
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  async delete(@Param('id') id: number): Promise<MessageResponse> {
    //TODO tokens must be removed from Redis
    await this.userRepository.softDelete(id)
    return {
      message: `User with ID "${id}" has been deleted`,
    }
  }

  @MessagePattern(messagePattern.shop.getUserById)
  async getOneByIdForRmq({id}): Promise<User | null> {
    return this.userRepository.getOne(id)
  }

  @MessagePattern(messagePattern.shop.getUserByEmail)
  async getOneByEmail({email}: GetUserByEmail): Promise<User | null> {
    return this.userRepository.getUserByEmail(email)
  }
}
