import {Brand} from '../domain/brand/brand.entity'
import {Order} from '../domain/order/order.entity'
import {Product} from '../domain/product/product.entity'
import {ProductType} from '../domain/productType/productType.entity'
import {User} from '../domain/user/user.entity'

export type BrandOmit = Omit<Brand, 'updated_at' | 'deleted_at'>
export type ProductOmit = Omit<Product, 'updated_at' | 'deleted_at'>
export type ProductTypeOmit = Omit<ProductType, 'updated_at' | 'deleted_at'>
export type OrderOmit = Omit<Order, 'updated_at' | 'deleted_at'>
export type UserOmit = Omit<User, 'updated_at' | 'password' | 'token'>
