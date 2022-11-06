import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Order} from './order.entity'
import {OrderController} from './order.controller'
import {OrderRepository} from './order.repository'
import {OrderService} from './order.service'
import {UserService} from '../user/user.service'
import {UserRepository} from '../user/user.repository'
import {PaymentRepository} from '../payment/payment.repository'
import {ProductRepository} from '../product/product.repository'
import {ProductService} from '../product/product.service'

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [
    OrderRepository, OrderService, UserService, UserRepository, PaymentRepository, ProductRepository,
    ProductService,
  ],
})
export class OrderModule {}
