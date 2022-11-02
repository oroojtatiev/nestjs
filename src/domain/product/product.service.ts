import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ProductRepository} from './product.repository'
import {Product} from './product.entity'
import {getFormattedDateTime} from '../../functions/date'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository,
  ) {}

  prepareProduct(product: Product) {
    const {updatedAt, deletedAt, ...data} = product
    const createdAt = getFormattedDateTime(product.createdAt)

    return {...data, createdAt: createdAt}
  }

  async prepareList(offset: number, limit: number) {
    const data = await this.productRepository.getList(offset, limit)

    return data.map((el) => this.prepareProduct(el))
  }
}
