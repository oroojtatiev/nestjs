import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ProductTypeRepository} from './productType.repository'
import {prepareData} from '@libs/common/helper/function/data'
import {ProductTypeOmit} from '@libs/common/types/entityOmit.type'

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductTypeRepository) private readonly productTypeRepository: ProductTypeRepository,
  ) {}

  async checkIsNotExists(type_id: number): Promise<boolean> {
    const r = await this.productTypeRepository.findOne({
      where: {
        id: type_id,
      },
    })

    return r === null
  }

  async getList(offset: number, limit: number): Promise<ProductTypeOmit[]> {
    const data = await this.productTypeRepository.getList(offset, limit)

    return data.map((el) => prepareData(el))
  }
}
