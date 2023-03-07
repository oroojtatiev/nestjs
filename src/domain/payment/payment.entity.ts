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
  transaction_id: string

  @Column()
  paymentType: PaymentType

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn({nullable: true})
  deleted_at: Date

  @OneToOne(() => Order, order => order.payment)
  @JoinColumn()
  order: Order
}
