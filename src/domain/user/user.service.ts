import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import {UserRepository} from './user.repository'
import {getFormattedDateTime, prepareData} from '../../functions/date'
import {User} from './user.entity'
import {CreateUserDto} from './user.validation'

const saltRounds = 10

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async prepareList(offset: number, limit: number) {
    const data = await this.userRepository.getList(offset, limit)

    return data.map((el) => prepareData(el))
  }

  async checkEmail(email: string): Promise<boolean> {
    const isEmailFound = await this.userRepository.findOneBy({
      email: email,
    })

    return isEmailFound !== null
  }

  async postUser(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, saltRounds)

    return await this.userRepository.save({
      ...dto,
      password: passwordHash,
    })
  }

  async confirmEmail(email: string) {
    return this.userRepository.update({email}, {
      isEmailConfirmed: true,
    })
  }

  async getUser(username: string) {
    return this.userRepository.findOne({
      where: {
        email: username,
      },
    })
  }

  async prepareUser(user: User) {
    const {updatedAt, deletedAt, password, ...data} = user
    const createdAt = getFormattedDateTime(user.createdAt)

    return {...data, createdAt: createdAt}
  }
}
