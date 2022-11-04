import {
  Controller, Post, Body, Get, Query, Param, Delete, Put, UsePipes, HttpStatus, HttpException,
} from '@nestjs/common'
import {ProductRepository} from './product.repository'
import {ProductService} from './product.service'
import {JoiValidationPipe} from '../../infrastructure/pipes/validation.pipe'
import {ProductPostDto, productPostSchema, ProductPutDto, productPutSchema} from './product.validation'
import {ProductTypeService} from '../productType/productType.service'
import {prepareData} from '../../functions/date'

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
  @UsePipes(new JoiValidationPipe(productPostSchema))
  async create(@Body() data: ProductPostDto) {
    const isTypeIdNotExist = await this.productTypeService.isNotExist(data.productTypeId)

    if (isTypeIdNotExist) throw new HttpException('This typeId is not exist', HttpStatus.BAD_REQUEST)

    const product = await this.productRepository.save(data)

    return prepareData(product)
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(productPutSchema))
  async update(@Param('id') id: number, @Body() data: ProductPutDto) {
    await this.productRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.productRepository.deleteOrFail(id)

    return {
      message: `Product with ${id} has been deleted`,
    }
  }
}