import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {JwtService} from '@nestjs/jwt'
import {RmqModule} from '@libs/common'
import {AUTH_SERVICE, MAIL_SERVICE} from '@libs/common/constant/microservice'
import {User} from '@libs/common/entity/user.entity'
import {UserRepository} from './user.repository'
import {UserController} from './user.controller'
import {UserService} from './user.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RmqModule.register({name: AUTH_SERVICE}),
    RmqModule.register({name: MAIL_SERVICE}),
  ],
  providers: [UserRepository, UserService, JwtService],
  controllers: [UserController],
  exports: [RmqModule],
})
export class UserModule {}
