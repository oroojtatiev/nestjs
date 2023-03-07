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
  payment_id: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date

  @ManyToOne(() => User, user => user.orders, {
    nullable: false,
  })
  user: User

  @OneToMany(() => OrderItem, orderItem => orderItem.order, {
    nullable: false,
    cascade: true,
  })
  order_items: OrderItem[]

  @OneToOne(() => Payment, payment => payment.order, {
    nullable: false,
  })
  payment: Payment
}
