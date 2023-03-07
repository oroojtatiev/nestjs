import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UpdateResult} from 'typeorm'
import * as bcrypt from 'bcrypt'
import {UserRepository} from './user.repository'
import {CreateUserDto} from './user.validation'
import {User} from './user.entity'
import {UserOmit} from '../../type/EntityOmit.type'

const saltRounds = 10

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async getUserByEmail(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: username,
      },
    })
  }

  async getList(offset: number, limit: number): Promise<UserOmit[]> {
    const data = await this.userRepository.getList(offset, limit)
    return data.map((el) => this.prepareUser(el))
  }

  async getOne(id: number): Promise<UserOmit> {
    const user = await this.userRepository.getOneOrFail(id)
    return this.prepareUser(user)
  }

  async checkEmailExist(email: string): Promise<boolean> {
    const isEmailFound = await this.userRepository.findOneBy({
      email: email,
    })

    return isEmailFound !== null
  }

  async postUser(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, saltRounds)

    return await this.userRepository.save({
      ...dto,
      email: dto.email.toLowerCase(),
      password: passwordHash,
    })
  }

  async confirmEmail(email: string): Promise<UpdateResult> {
    return this.userRepository.update({email}, {
      is_email_confirmed: true,
    })
  }

  prepareUser(user: any): UserOmit { // TODO use UserOmit instead of "any"
    const {updated_at, password, token, ...data} = user
    return {...data}
  }
}
