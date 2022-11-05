import {
  BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToOne, OneToMany,
} from 'typeorm'
import {User} from '../user/user.entity'
import {OrderItem} from '../orderItem/orderItem.entity'

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => User, user => user.orders)
  user: User

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[]
}
