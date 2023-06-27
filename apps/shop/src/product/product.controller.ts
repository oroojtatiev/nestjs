import {
  Controller, Post, Body, Get, Query, Param, Delete, Put, UsePipes, HttpStatus, HttpException, UseGuards,
} from '@nestjs/common'
import {JwtGuard} from '@libs/common'
import {BodyValidatePipe} from '@libs/common/helper/pipe/validation.pipe'
import {Product} from '@libs/common/entity/product.entity'
import {prepareData} from '@libs/common/helper/function/data'
import {Role, RoleGuard} from '@libs/common/role'
import {CreateResponse, MessageResponse} from '@libs/common/types/response.type'
import {ProductOmit} from '@libs/common/types/entityOmit.type'
import {ProductRepository} from './product.repository'
import {ProductService} from './product.service'
import {ProductTypeService} from '../productType/productType.service'
import {ProductTypeRepository} from '../productType/productType.repository'
import {BrandRepository} from '../brand/brand.repository'
import {ProductPostDto, productPostSchema, ProductPutDto, productPutSchema} from './product.validation'

@Controller('products')
export class ProductController {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productService: ProductService,
    private readonly productTypeService: ProductTypeService,
    private readonly productTypeRepository: ProductTypeRepository,
    private readonly brandRepository: BrandRepository,
  ) {}

  @Get('admin')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  async getListForAdmin(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<ProductOmit[]> {
    return this.productService.getList(offset, limit)
  }

  @Get()
  async getListForUser(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<ProductOmit[]> {
    return this.productService.getPublishedList(offset, limit)
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ProductOmit> {
    const result = await this.productRepository.getOneOrFail(id)
    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  @UsePipes(new BodyValidatePipe(productPostSchema))
  async create(@Body() data: ProductPostDto): Promise<CreateResponse<ProductOmit>> {
    const isTypeIdNotExist = await this.productTypeService.checkIsNotExists(data.type_id)

    if (isTypeIdNotExist) throw new HttpException('This type_id is not exist', HttpStatus.BAD_REQUEST)

    const productType = await this.productTypeRepository.getOneOrFail(data.type_id)
    const brand = await this.brandRepository.getOneOrFail(data.brand_id)

    const product = new Product()
    product.type = productType
    product.brand = brand
    product.serial = data.serial
    product.title = data.title
    product.scale = data.scale
    product.weight = data.weight
    product.image = data.image
    product.price = data.price
    product.in_stock = data.in_stock
    product.is_published = data.is_published

    const newProduct = await this.productRepository.save(product)

    return {
      data: newProduct,
      message: 'Product has been successfully created',
    }
  }

  @Put(':id')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  @UsePipes(new BodyValidatePipe(productPutSchema))
  async update(@Param('id') id: number, @Body() data: ProductPutDto): Promise<ProductOmit> {
    await this.productRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  async delete(@Param('id') id: number): Promise<MessageResponse> {
    await this.productRepository.deleteOrFail(id)
    return {
      message: `Product with ${id} has been deleted`,
    }
  }
}
