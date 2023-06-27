import {Injectable} from '@nestjs/common'
import {DataSource, Repository, UpdateResult} from 'typeorm'
import {User} from '@libs/common/entity/user.entity'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  async getList(offset = 0, limit = 10): Promise<User[]> {
    return this.find({
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    })
  }

  async getUserByEmail(username: string): Promise<User | null> {
    return this.findOne({
      where: {
        email: username,
      },
    })
  }

  async getOne(id: number) {
    return this.findOne({
      where: {id},
    })
  }

  async getOneOrFail(id: number) {
    return this.findOneOrFail({
      where: {id},
    })
  }

  async verifyEmail(email: string): Promise<UpdateResult> {
    return this.update({email}, {
      is_email_verified: true,
    })
  }
}
