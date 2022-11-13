import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {Product} from './product.entity'

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager())
  }

  async getList(offset = 0, limit = 10): Promise<Product[]> {
    return this.find({
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    })
  }

  async getListForUser(offset = 0, limit = 10): Promise<Product[]> {
    return await this.createQueryBuilder('product')
      .where('product.isPublished = true')
      .orderBy('product.id', 'ASC')
      .skip(offset)
      .take(limit)
      .getMany()
  }

  async getOneOrFail(id: number) {
    return this.findOneOrFail({
      where: {id},
    })
  }

  async getOneWithType(id: number) {
    return await this.findOne({
      where: {id: id},
      relations: {
        type: true,
      },
      select: {
        type: {
          id: true,
          name: true,
        },
      },
    })
  }

  async deleteOrFail(id: number) {
    await this.findOneOrFail({
      where: {id},
    })
    return this.delete(id)
  }
}
