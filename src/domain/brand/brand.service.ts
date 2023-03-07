import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {BrandRepository} from './brand.repository'
import {prepareData} from '../../function/data'
import {BrandOmit} from '../../type/EntityOmit.type'

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
