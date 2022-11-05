import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ProductRepository} from './product.repository'
import {prepareData} from '../../helpers/data'
import {Product} from './product.entity'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository,
  ) {}

  async prepareList(offset: number, limit: number) {
    const data = await this.productRepository.getList(offset, limit)
    return data.map((el) => prepareData(el))
  }

  async prepareSavedProduct(product: Product) {
    const item = await this.productRepository.findOne({
      where: {id: product.id},
      relations: ['type'],
      select: {
        type: {
          id: true,
          name: true,
        },
      },
    })

    return prepareData(item)
  }
}
