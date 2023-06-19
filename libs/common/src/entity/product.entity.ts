import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,
  JoinColumn,
} from 'typeorm'
import {ProductType} from './productType.entity'
import {Brand} from './brand.entity'

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

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
  in_stock: boolean

  @Column({default: false})
  is_published: boolean

  @Column({default: 0})
  views: number

  @Column({nullable: true})
  quantity: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date

  @ManyToOne(() => ProductType)
  @JoinColumn({name: 'type_id'})
  type: ProductType

  @ManyToOne(() => Brand)
  @JoinColumn({name: 'brand_id'})
  brand: Brand
}
