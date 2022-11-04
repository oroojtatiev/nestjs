import {DataSource, Repository} from 'typeorm'
import {User} from './user.entity'
import {Injectable} from '@nestjs/common'

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

  async getOneOrFail(id: number) {
    return this.findOneOrFail({
      where: {id},
    })
  }
}
