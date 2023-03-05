import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {Brand} from './brand.entity'

@Injectable()
export class BrandRepository extends Repository<Brand> {
  constructor(private dataSource: DataSource) {
    super(Brand, dataSource.createEntityManager())
  }

  async getList(offset = 0, limit = 10): Promise<Brand[]> {
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

  async deleteOrFail(id: number) {
    await this.findOneOrFail({
      where: {id},
    })
    return this.delete(id)
  }
}
