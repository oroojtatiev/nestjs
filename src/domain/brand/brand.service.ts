import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {BrandRepository} from './brand.repository'
import {prepareData} from '../../helpers/data'

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandRepository) private readonly brandRepository: BrandRepository,
  ) {}

  async checkIsNotExists(typeId: number): Promise<boolean> {
    const r = await this.brandRepository.findOne({
      where: {
        id: typeId,
      },
    })

    return r === null
  }

  async getList(offset: number, limit: number) {
    const data = await this.brandRepository.getList(offset, limit)

    return data.map((el) => prepareData(el))
  }
}
