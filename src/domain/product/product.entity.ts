import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,
  RelationId,
} from 'typeorm'
import {ProductType} from '../productType/productType.entity'

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @RelationId((product: Product) => product.type)
  typeId: number

  @Column({length: 15})
  serial: string

  @Column({length: 55})
  title: string

  @Column({length: 6, nullable: true})
  scale: string

  @Column({width: 5, type: 'int'})
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

  @Column({nullable: true})
  quantity: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => ProductType)
  type: ProductType
}
