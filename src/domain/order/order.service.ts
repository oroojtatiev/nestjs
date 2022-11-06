import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {prepareData} from '../../helpers/data'
import {Order} from './order.entity'
import {OrderRepository} from './order.repository'
import {ProductRepository} from '../product/product.repository'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderRepository) private readonly orderRepository: OrderRepository,
    @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository,
  ) {}

  async getList(offset: number, limit: number) {
    const data = await this.orderRepository.getList(offset, limit)
    return data.map((el) => prepareData(el))
  }

  async getSavedOrder(data: Order) {
    const order = await this.orderRepository.findOne({
      where: {id: data.id},
      relations: {
        orderItems: true,
      },
    })

    const orderItems = await Promise.all(order.orderItems.map(async orderItem => {
      const product = await this.productRepository.findOneBy({id: orderItem.productId})
      return prepareData(product)
    }))

    const orderWithProducts = {...order, orderItems: orderItems}

    return prepareData(orderWithProducts)
  }
}
