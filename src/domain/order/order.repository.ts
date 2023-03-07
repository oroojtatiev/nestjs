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

  async getOneOrFail(id: number): Promise<Order> {
    return this.findOneOrFail({
      where: {id},
    })
  }

  async getOrderWithProducts(id: number): Promise<Order[]> {
    return this.find({
      relations: {
        order_items: {
          product: true,
        },
      },
      where: {
        id: id,
      },
    })
  }
}
