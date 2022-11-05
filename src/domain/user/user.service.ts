import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import {UserRepository} from './user.repository'
import {CreateUserDto} from './user.validation'
import {User} from './user.entity'

const saltRounds = 10

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async getUserByEmail(username: string) {
    return this.userRepository.findOne({
      where: {
        email: username,
      },
    })
  }

  async getList(offset: number, limit: number) {
    const data = await this.userRepository.getList(offset, limit)
    return data.map((el) => this.prepareUser(el))
  }

  async getOne(id: number) {
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
      password: passwordHash,
    })
  }

  async confirmEmail(email: string) {
    return this.userRepository.update({email}, {
      isEmailConfirmed: true,
    })
  }

  prepareUser(user: User) {
    const {updatedAt, password, token, ...data} = user
    return {...data}
  }
}
