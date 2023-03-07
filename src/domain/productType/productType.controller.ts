import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes} from '@nestjs/common'
import {ProductTypeRepository} from './productType.repository'
import {ProductTypeService} from './productType.service'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'
import {
  ProductTypePostDto, productTypePostSchema, ProductTypePutDto, productTypePutSchema,
} from './productType.validation'
import {JwtAuthGuard} from '../../auth/jwt.guard'
import {prepareData} from '../../function/data'
import {ProductTypeOmit} from '../../type/EntityOmit.type'
import {DeleteResponse} from '../../type/Response.type'

@Controller('product/type')
export class ProductTypeController {
  constructor(
    private readonly productTypeRepository: ProductTypeRepository,
    private readonly productTypeService: ProductTypeService,
  ) {}

  @Get()
  async getList(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<ProductTypeOmit[]> {
    return this.productTypeService.getList(offset, limit)
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ProductTypeOmit> {
    const result = await this.productTypeRepository.getOneOrFail(id)
    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(productTypePostSchema))
  async create(@Body() data: ProductTypePostDto) { // TODO need to type
    const productType = await this.productTypeRepository.save(data)
    return {
      data: prepareData(productType),
      message: 'Product type has been successfully created',
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(productTypePutSchema))
  async update(@Param('id') id: number, @Body() data: ProductTypePutDto): Promise<ProductTypeOmit> {
    await this.productTypeRepository.update(id, data)
    return this.getOne(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<DeleteResponse> {
    await this.productTypeRepository.deleteOrFail(id)
    return {
      message: `Product type with ${id} has been deleted`,
    }
  }
}
