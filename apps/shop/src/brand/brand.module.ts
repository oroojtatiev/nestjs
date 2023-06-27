import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Brand} from '@libs/common/entity/brand.entity'
import {RmqModule} from '@libs/common'
import {AUTH_SERVICE} from '@libs/common/constant/microservice'
import {BrandController} from './brand.controller'
import {BrandService} from './brand.service'
import {BrandRepository} from './brand.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    RmqModule.register({name: AUTH_SERVICE}),
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandService, BrandRepository],
})
export class BrandModule {}
