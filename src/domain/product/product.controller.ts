import {
  Controller, Post, Body, Get, Query, Param, Delete, Put, UsePipes, HttpStatus, HttpException, UseGuards,
} from '@nestjs/common'
import {ProductRepository} from './product.repository'
import {ProductService} from './product.service'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'
import {ProductPostDto, productPostSchema, ProductPutDto, productPutSchema} from './product.validation'
import {ProductTypeService} from '../productType/productType.service'
import {JwtAuthGuard} from '../../auth/jwt.guard'
import {Product} from './product.entity'
import {ProductTypeRepository} from '../productType/productType.repository'
import {prepareData} from '../../functions/helper'

@Controller('products')
export class ProductController {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productService: ProductService,
    private readonly productTypeService: ProductTypeService,
    private readonly productTypeRepository: ProductTypeRepository,
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
    const isTypeIdNotExist = await this.productTypeService.checkIsNotExists(data.typeId)

    if (isTypeIdNotExist) throw new HttpException('This typeId is not exist', HttpStatus.BAD_REQUEST)

    const productType = await this.productTypeRepository.getOneOrFail(data.typeId)

    const product = new Product()
    product.serial = data.serial
    product.title = data.title
    product.weight = data.weight
    product.price = data.price
    product.type = productType

    const newProduct = await this.productRepository.save(product)

    return prepareData(newProduct)
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
