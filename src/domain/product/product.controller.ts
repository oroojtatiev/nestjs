import {Controller, Post, Body, Get, Query, Param, Delete, Put, UsePipes} from '@nestjs/common'
import {ProductRepository} from './product.repository'
import {ProductService} from './product.service'
import {JoiValidationPipe} from '../../infrastructure/pipes/validation.pipe'
import {productDtoSchema} from './product.validation'
import {Product} from './product.entity'

@Controller('products')
export class ProductController {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productService: ProductService,
  ) {}

  @Post()
  @UsePipes(new JoiValidationPipe(productDtoSchema))
  async create(@Body() data: unknown) {
    // TODO implement typeId checking

    const product = await this.productRepository.save(data)

    return this.productService.prepareProduct(product)
  }

  @Get()
  async findList(@Query('offset') offset: number, @Query('limit') limit: number) {
    return this.productService.prepareList(offset, limit)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.productRepository.getOneOrFail(id)

    return this.productService.prepareProduct(result)
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(productDtoSchema))
  async update(@Param('id') id: number, @Body() data: Product) {
    await this.productRepository.update(id, data)

    return {id, ...data}
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.productRepository.deleteOrFail(id)

    return {
      message: `Product with ${id} has been deleted`,
    }
  }
}
