import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm'
import {Order} from '../order/order.entity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({length: 15})
  firstname: string

  @Column({length: 15})
  lastname: string

  @Column()
  email: string

  @Column({length: 60})
  password: string

  @Column({length: 255, nullable: true})
  token: string

  @Column({nullable: true})
  tokenExpire: Date

  @Column({default: false})
  isEmailConfirmed: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn({nullable: true})
  updatedAt: Date

  @DeleteDateColumn({nullable: true})
  deletedAt: Date

  @OneToMany(() => Order, orders => orders.user)
  orders: Order[]
}
