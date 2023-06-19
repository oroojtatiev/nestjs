import {Injectable} from '@nestjs/common'
import {DataSource, DeleteResult, Repository} from 'typeorm'
import {Brand} from '@libs/common/entity/brand.entity'

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

  async getOneOrFail(id: number): Promise<Brand> {
    return this.findOneOrFail({
      where: {id},
    })
  }

  async deleteOrFail(id: number): Promise<DeleteResult> {
    await this.findOneOrFail({
      where: {id},
    })
    return this.delete(id)
  }
}
