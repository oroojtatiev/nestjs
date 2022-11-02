import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm'

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({length: 15})
  serial: string

  @Column({length: 55})
  title: string

  @Column({length: 6, nullable: true})
  scale: string

  @Column({width: 5})
  weight: number

  @Column({length: 55, nullable: true})
  image: string

  @Column({width: 5})
  price: number

  @Column({nullable: true})
  inStock: boolean

  @Column({default: false})
  isPublished: boolean

  @Column({default: 0})
  views: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
