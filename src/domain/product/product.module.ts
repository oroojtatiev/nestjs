import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Product} from './product.entity'
import {ProductController} from './product.controller'
import {ProductRepository} from './product.repository'
import {ProductService} from './product.service'

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
