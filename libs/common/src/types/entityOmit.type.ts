import {User} from '@libs/common'
import {Brand} from '@libs/common/entity/brand.entity'
import {Order} from '@libs/common/entity/order.entity'
import {ProductType} from '@libs/common/entity/productType.entity'
import {Product} from '@libs/common/entity/product.entity'

export type BrandOmit = Omit<Brand, 'updated_at' | 'deleted_at'>
export type ProductOmit = Omit<Product, 'updated_at' | 'deleted_at'>
export type ProductTypeOmit = Omit<ProductType, 'updated_at' | 'deleted_at'>
export type OrderOmit = Omit<Order, 'updated_at' | 'deleted_at'>
export type UserOmit = Omit<User, 'updated_at' | 'password' | 'refresh_token'>
