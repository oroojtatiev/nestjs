import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {ProductType} from './productType.entity'

@Injectable()
export class ProductTypeRepository extends Repository<ProductType> {
  constructor(private dataSource: DataSource) {
    super(ProductType, dataSource.createEntityManager())
  }

  async getList(offset = 0, limit = 10): Promise<ProductType[]> {
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
