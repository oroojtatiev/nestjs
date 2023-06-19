import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {prepareData} from '@libs/common/helper/function/data'
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
}
