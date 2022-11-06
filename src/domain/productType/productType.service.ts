import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ProductTypeRepository} from './productType.repository'
import {prepareData} from '../../helpers/data'

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

  async getList(offset: number, limit: number) {
    const data = await this.productTypeRepository.getList(offset, limit)

    return data.map((el) => prepareData(el))
  }
}
