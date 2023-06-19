import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {RmqModule} from '@libs/common'
import {AUTH_SERVICE} from '@libs/common/constant/microservice'
import {ProductType} from '@libs/common/entity/productType.entity'
import {ProductTypeController} from './productType.controller'
import {ProductTypeService} from './productType.service'
import {ProductTypeRepository} from './productType.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductType]),
    RmqModule.register({name: AUTH_SERVICE}),
  ],
  controllers: [ProductTypeController],
  providers: [ProductTypeService, ProductTypeRepository],
  exports: [ProductTypeService, ProductTypeRepository],
})
export class ProductTypeModule {}
