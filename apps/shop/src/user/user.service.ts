import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UserOmit} from '@libs/common/types/entityOmit.type'
import {User} from '@libs/common'
import {getHash} from '@libs/common/helper/function/bcrypt'
import {UserRepository} from './user.repository'
import {CreateUserDto} from './user.validation'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
  ) {}

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

  async save(dto: CreateUserDto): Promise<User> {
    const passwordHash = await getHash(dto.password)

    return await this.userRepository.save({
      ...dto,
      email: dto.email.toLowerCase(),
      password: passwordHash,
    })
  }

  //TODO use UserOmit type for user argument
  prepareUser(user: any): UserOmit {
    const {updated_at, password, refresh_token, ...data} = user
    return {...data}
  }
}
