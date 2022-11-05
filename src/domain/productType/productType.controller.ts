import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes} from '@nestjs/common'
import {ProductTypeRepository} from './productType.repository'
import {ProductTypeService} from './productType.service'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'
import {
  ProductTypePostDto,
  productTypePostSchema,
  ProductTypePutDto,
  productTypePutSchema,
} from './productType.validation'
import {JwtAuthGuard} from '../../auth/jwt.guard'
import {prepareData} from '../../functions/helper'

@Controller('product/type')
export class ProductTypeController {
  constructor(
    private readonly productTypeRepository: ProductTypeRepository,
    private readonly productTypeService: ProductTypeService,
  ) {}

  @Get()
  async getList(@Query('offset') offset: number, @Query('limit') limit: number) {
    return this.productTypeService.prepareList(offset, limit)
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const result = await this.productTypeRepository.getOneOrFail(id)

    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(productTypePostSchema))
  async create(@Body() data: ProductTypePostDto) {
    const product = await this.productTypeRepository.save(data)

    return prepareData(product)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(productTypePutSchema))
  async update(@Param('id') id: number, @Body() data: ProductTypePutDto) {
    await this.productTypeRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {
    await this.productTypeRepository.deleteOrFail(id)

    return {
      message: `Product type with ${id} has been deleted`,
    }
  }
}
