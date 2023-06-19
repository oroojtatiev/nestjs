import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {RmqModule} from '@libs/common'
import {Product} from '@libs/common/entity/product.entity'
import {AUTH_SERVICE} from '@libs/common/constant/microservice'
import {ProductController} from './product.controller'
import {ProductRepository} from './product.repository'
import {ProductService} from './product.service'
import {ProductTypeService} from '../productType/productType.service'
import {ProductTypeRepository} from '../productType/productType.repository'
import {BrandRepository} from '../brand/brand.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    RmqModule.register({name: AUTH_SERVICE}),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductTypeService, ProductTypeRepository, BrandRepository],
})
export class ProductModule {}
