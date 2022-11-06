import {
  BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,
  OneToMany, OneToOne, RelationId,
} from 'typeorm'
import {User} from '../user/user.entity'
import {OrderItem} from '../orderItem/orderItem.entity'
import {Payment} from '../payment/payment.entity'

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @RelationId((order: Order) => order.payment)
  paymentId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => User, user => user.orders, {
    nullable: false,
  })
  user: User

  @OneToMany(() => OrderItem, orderItem => orderItem.order, {
    nullable: false,
    cascade: true,
  })
  orderItems: OrderItem[]

  @OneToOne(() => Payment, payment => payment.order, {
    nullable: false,
  })
  payment: Payment
}
