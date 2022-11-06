import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {prepareData} from '../../helpers/data'
import {Order} from './order.entity'
import {OrderRepository} from './order.repository'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderRepository) private readonly orderRepository: OrderRepository,
  ) {}

  async getList(offset: number, limit: number) {
    const data = await this.orderRepository.getList(offset, limit)
    return data.map((el) => prepareData(el))
  }

  async prepareSavedProduct(order: Order) {
    const item = await this.orderRepository.findOne({
      where: {id: order.id},
      relations: {},
      select: {},
    })

    return prepareData(item)
  }
}
