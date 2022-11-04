import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './user.entity'
import {UserRepository} from './user.repository'
import {UserController} from './user.controller'
import {UserService} from './user.service'
import {AuthService} from '../../auth/auth.service'
import {JwtService} from '@nestjs/jwt'
import {MailService} from '../../mail/mail.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UserService, AuthService, JwtService, MailService],
  controllers: [UserController],
})
export class UserModule {}
