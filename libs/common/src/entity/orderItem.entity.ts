import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId} from 'typeorm'
import {Product} from './product.entity'
import {Order} from './order.entity'

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @RelationId((orderItem: OrderItem) => orderItem.order)
  orderId: number

  @RelationId((orderItem: OrderItem) => orderItem.product)
  productId: number

  @Column()
  quantity: number

  @ManyToOne(() => Order, order => order.order_items, {
    nullable: false,
  })
  order: Order

  @ManyToOne(() => Product, product => product.id, {
    nullable: false,
  })
  product: Product
}
