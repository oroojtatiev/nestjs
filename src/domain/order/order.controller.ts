import {Controller, Post, Body, Get, Query, Param, Delete, Put, UseGuards, UsePipes} from '@nestjs/common'
import {JwtAuthGuard} from '../../auth/jwt.guard'
import {OrderRepository} from './order.repository'
import {prepareData} from '../../helpers/data'
import {OrderService} from './order.service'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'
import {CreateOrderDto, createOrderSchema, UpdateOrderDto} from './order.validation'
import {User} from '../../infrastructure/decorators/user.decorator'
import {UserService} from '../user/user.service'
import {Payment} from '../payment/payment.entity'
import {Order} from './order.entity'
import {PaymentRepository} from '../payment/payment.repository'
import {ProductService} from '../product/product.service'

@Controller('orders')
export class OrderController {
  constructor(
    private readonly productService: ProductService,
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getList(@Query('offset') offset: number, @Query('limit') limit: number) {
    return this.orderService.getList(offset, limit)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const result = await this.orderRepository.getOneOrFail(id)
    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(createOrderSchema))
  async create(@User() user: any, @Body() data: CreateOrderDto) {
    const userEntity = await this.userService.getUserByEmail(user.email)

    const paymentEntity = new Payment()
    paymentEntity.transactionId = data.transactionId
    paymentEntity.paymentType = data.paymentType
    const payment = await this.paymentRepository.save(paymentEntity)

    const orderEntity = new Order()
    orderEntity.user = userEntity
    orderEntity.orderItems = await this.productService.getOrderProducts(data.products)
    orderEntity.payment = payment

    await this.orderRepository.save(orderEntity)

    return {
      data: await this.orderRepository.getOrderWithProducts(orderEntity.id),
      message: 'Order has been successfully created',
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() data: UpdateOrderDto) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {}
}
