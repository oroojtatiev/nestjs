import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ProductTypeRepository} from './productType.repository'
import {ProductType} from './productType.entity'
import {getFormattedDateTime} from '../../functions/date'

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductTypeRepository) private readonly productTypeRepository: ProductTypeRepository,
  ) {}

  async checkIsNotExists(typeId: number): Promise<boolean> {
    const r = await this.productTypeRepository.findOne({
      where: {
        id: typeId,
      },
    })

    return r === null
  }

  prepareProductType(product: ProductType) {
    const {updatedAt, deletedAt, ...data} = product
    const createdAt = getFormattedDateTime(product.createdAt)

    return {...data, createdAt: createdAt}
  }

  async prepareList(offset: number, limit: number) {
    const data = await this.productTypeRepository.getList(offset, limit)

    return data.map((el) => this.prepareProductType(el))
  }
}
