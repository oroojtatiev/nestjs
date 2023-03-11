import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm'
import {Order} from '../order/order.entity'
import {Role} from '../../role/roles.enum'

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
  token_expire: Date

  @Column({default: false})
  is_email_confirmed: boolean

  @Column({
    array: true,
    type: 'enum',
    enum: Role,
    default: [Role.User],
  })
  roles: Role[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn({nullable: true})
  updated_at: Date

  @DeleteDateColumn({nullable: true})
  deleted_at: Date

  @OneToMany(() => Order, orders => orders.user)
  orders: Order[]
}
