import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {prepareData} from '@libs/common/helper/function/data'
import {BrandOmit} from '@libs/common/types/entityOmit.type'
import {BrandRepository} from './brand.repository'

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandRepository) private readonly brandRepository: BrandRepository,
  ) {}

  async getList(offset: number, limit: number): Promise<BrandOmit[]> {
    const data = await this.brandRepository.getList(offset, limit)

    return data.map((el) => prepareData(el))
  }
}
