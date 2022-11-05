import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import {UserRepository} from './user.repository'
import {CreateUserDto} from './user.validation'
import {prepareData} from '../../helpers/data'

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
}
