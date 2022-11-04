import {
  Controller, Post, Body, Get, Query, Param, Delete, Put, UsePipes, HttpStatus, HttpException, UseGuards,
} from '@nestjs/common'
import {ProductRepository} from './product.repository'
import {ProductService} from './product.service'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'
import {ProductPostDto, productPostSchema, ProductPutDto, productPutSchema} from './product.validation'
import {ProductTypeService} from '../productType/productType.service'
import {prepareData} from '../../functions/date'
import {JwtAuthGuard} from '../../auth/jwt.guard'

@Controller('products')
export class ProductController {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productService: ProductService,
    private readonly productTypeService: ProductTypeService,
  ) {}

  @Get()
  async getList(@Query('offset') offset: number, @Query('limit') limit: number) {
    return this.productService.prepareList(offset, limit)
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const result = await this.productRepository.getOneOrFail(id)

    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(productPostSchema))
  async create(@Body() data: ProductPostDto) {
    const isTypeIdNotExist = await this.productTypeService.isNotExist(data.typeId)

    if (isTypeIdNotExist) throw new HttpException('This typeId is not exist', HttpStatus.BAD_REQUEST)

    const product = await this.productRepository.save(data)

    return prepareData(product)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(productPutSchema))
  async update(@Param('id') id: number, @Body() data: ProductPutDto) {
    await this.productRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {
    await this.productRepository.deleteOrFail(id)

    return {
      message: `Product with ${id} has been deleted`,
    }
  }
}
