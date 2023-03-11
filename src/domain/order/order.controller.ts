import {Controller, Post, Body, Get, Query, Param, Delete, Put, UseGuards, UsePipes} from '@nestjs/common'
import {JwtAuthGuard} from '../../auth/jwt.guard'
import {OrderRepository} from './order.repository'
import {prepareData} from '../../function/data'
import {OrderService} from './order.service'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'
import {CreateOrderDto, createOrderSchema, UpdateOrderDto} from './order.validation'
import {User} from '../../infrastructure/decorators/user.decorator'
import {UserService} from '../user/user.service'
import {Payment} from '../payment/payment.entity'
import {Order} from './order.entity'
import {PaymentRepository} from '../payment/payment.repository'
import {ProductService} from '../product/product.service'
import {OrderOmit} from '../../type/EntityOmit.type'
import {CreateResponse} from '../../type/Response.type'
import {Role} from '../../role/roles.enum'
import {TokenBaseData} from '../../auth/auth.service'
import {RoleGuard} from '../../role/role.guard'

@Controller('orders')
export class OrderController {
  constructor(
    private readonly productService: ProductService,
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async getList(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<OrderOmit[]> {
    return this.orderService.getList(offset, limit)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async getOne(@Param('id') id: number): Promise<OrderOmit> {
    const result = await this.orderRepository.getOneOrFail(id)
    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(createOrderSchema))
  async create(@User() user: TokenBaseData, @Body() data: CreateOrderDto): Promise<CreateResponse<Order[]>> {
    const userEntity = await this.userService.getUserByEmail(user.username)

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
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async update(@Param('id') id: number, @Body() data: UpdateOrderDto) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  async delete(@Param('id') id: number) {}
}
