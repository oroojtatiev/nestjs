import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {Payment} from '@libs/common/entity/payment.entity'

@Injectable()
export class PaymentRepository extends Repository<Payment> {
  constructor(private dataSource: DataSource) {
    super(Payment, dataSource.createEntityManager())
  }

  async getList(offset = 0, limit = 10): Promise<Payment[]> {
    return this.find({
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    })
  }
}
