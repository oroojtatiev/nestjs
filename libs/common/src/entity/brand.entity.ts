import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm'
import {Product} from './product.entity'

@Entity()
export class Brand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({length: 30})
  name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date

  @OneToMany(() => Product, (product) => product.type)
  products: Product[]
}
