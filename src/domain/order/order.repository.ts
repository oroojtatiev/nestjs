import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {Order} from './order.entity'

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager())
  }

  async getList(offset = 0, limit = 10): Promise<Order[]> {
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

  async getOrderWithProducts(id: number) {
    return this.find({
      relations: {
        orderItems: {
          product: true,
        },
      },
      where: {
        id: id,
      },
    })
  }
}
