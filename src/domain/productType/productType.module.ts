import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ProductType} from './productType.entity'
import {ProductTypeController} from './productType.controller'
import {ProductTypeService} from './productType.service'
import {ProductTypeRepository} from './productType.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ProductType])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService, ProductTypeRepository],
  exports: [ProductTypeService, ProductTypeRepository],
})
export class ProductTypeModule {}
