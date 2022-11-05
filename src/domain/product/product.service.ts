import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ProductRepository} from './product.repository'
import {prepareData} from '../../functions/helper'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository,
  ) {}

  async prepareList(offset: number, limit: number) {
    const data = await this.productRepository.getList(offset, limit)
    return data.map((el) => prepareData(el))
  }
}
