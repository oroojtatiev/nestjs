import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm'
import {Product} from '../product/product.entity'

@Entity()
export class ProductType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({length: 30})
  name: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @OneToMany(() => Product, (product) => product.type)
  products: Product[]
}
