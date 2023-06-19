import {Controller, Post, Body, Get, Query, Param, Delete, Put, UseGuards, UsePipes} from '@nestjs/common'
import {JwtGuard} from '@libs/common'
import {prepareData} from '@libs/common/helper/function/data'
import {CreateResponse} from '@libs/common/types/response.type'
import {OrderOmit} from '@libs/common/types/entityOmit.type'
import {Role, RoleGuard} from '@libs/common/role'
import {BodyValidatePipe} from '@libs/common/helper/pipe/validation.pipe'
import {UserToken} from '@libs/common/helper/decorator/user.decorator'
import {Payment} from '@libs/common/entity/payment.entity'
import {Order} from '@libs/common/entity/order.entity'
import {IUserToken} from '@libs/common/types/auth.type'
import {OrderRepository} from './order.repository'
import {OrderService} from './order.service'
import {CreateOrderDto, createOrderSchema, UpdateOrderDto} from './order.validation'
import {PaymentRepository} from '../payment/payment.repository'
import {ProductService} from '../product/product.service'
import {UserService} from '../user/user.service'
import {UserRepository} from '../user/user.repository'

@Controller('orders')
export class OrderController {
  constructor(
    private readonly productService: ProductService,
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get()
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  async getList(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<OrderOmit[]> {
    return this.orderService.getList(offset, limit)
  }

  @Get(':id')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  async getOne(@Param('id') id: number): Promise<OrderOmit> {
    const result = await this.orderRepository.getOneOrFail(id)
    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtGuard)
  @UsePipes(new BodyValidatePipe(createOrderSchema))
  async create(@UserToken() user: IUserToken, @Body() data: CreateOrderDto): Promise<CreateResponse<Order[]>> {
    const userEntity = await this.userRepository.getUserByEmail(user.username)

    const paymentEntity = new Payment()
    paymentEntity.transaction_id = data.transaction_id
    paymentEntity.paymentType = data.paymentType
    const payment = await this.paymentRepository.save(paymentEntity)

    const orderEntity = new Order()
    orderEntity.user = userEntity
    orderEntity.order_items = await this.productService.getOrderProducts(data.products)
    orderEntity.payment = payment

    await this.orderRepository.save(orderEntity)

    return {
      data: await this.orderRepository.getOrderWithProducts(orderEntity.id),
      message: 'Order has been successfully created',
    }
  }

  @Put(':id')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  async update(@Param('id') id: number, @Body() data: UpdateOrderDto) {}

  @Delete(':id')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  async delete(@Param('id') id: number) {}
}
