import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {RmqModule} from '@libs/common'
import {Order} from '@libs/common/entity/order.entity'
import {OrderItem} from '@libs/common/entity/orderItem.entity'
import {AUTH_SERVICE} from '@libs/common/constant/microservice'
import {OrderController} from './order.controller'
import {OrderRepository} from './order.repository'
import {OrderService} from './order.service'
import {PaymentRepository} from '../payment/payment.repository'
import {ProductRepository} from '../product/product.repository'
import {ProductService} from '../product/product.service'
import {UserRepository} from '../user/user.repository'
import {UserService} from '../user/user.service'
import {Payment} from '@libs/common/entity/payment.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Payment]),
    RmqModule.register({name: AUTH_SERVICE}),
  ],
  controllers: [OrderController],
  providers: [
    OrderRepository, OrderService, UserService, UserRepository, PaymentRepository, ProductRepository,
    ProductService,
  ],
})
export class OrderModule {}
