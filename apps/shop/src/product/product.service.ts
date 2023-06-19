import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ProductRepository} from './product.repository'
import {prepareData} from '@libs/common/helper/function/data'
import {OrderItem} from '@libs/common/entity/orderItem.entity'
import {ProductOmit} from '@libs/common/types/entityOmit.type'
import {OrderItemDto} from '../order/order.validation'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository,
  ) {}

  async getList(offset: number, limit: number): Promise<ProductOmit[]> {
    const data = await this.productRepository.getList(offset, limit)
    return data.map((el) => prepareData(el))
  }

  async getPublishedList(offset: number, limit: number): Promise<ProductOmit[]> {
    const data = await this.productRepository.getPublishedList(offset, limit)
    return data.map((el) => prepareData(el))
  }

  async getOrderProducts(products: OrderItemDto): Promise<OrderItem[]> {
    return await Promise.all(products.map(async (el) => {
      const orderItem = new OrderItem()
      orderItem.product = await this.productRepository.findOneBy({id: el.productId})
      orderItem.quantity = el.quantity
      return orderItem
    }))
  }
}
