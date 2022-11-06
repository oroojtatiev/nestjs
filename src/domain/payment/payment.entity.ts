import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm'
import {Order} from '../order/order.entity'

export enum PaymentType {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
}

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({length: 25})
  transactionId: string

  @Column()
  paymentType: PaymentType

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn({nullable: true})
  deletedAt: Date

  @OneToOne(() => Order, order => order.payment)
  @JoinColumn()
  order: Order
}
