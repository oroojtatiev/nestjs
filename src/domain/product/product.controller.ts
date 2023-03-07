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
import {BrandRepository} from '../brand/brand.repository'
import {prepareData} from '../../function/data'
import {ProductOmit} from '../../type/EntityOmit.type'
import {CreateResponse, DeleteResponse} from '../../type/Response.type'

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
  @UseGuards(JwtAuthGuard)
  async getList(
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
    return this.productService.getListForUser(offset, limit)
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ProductOmit> {
    const result = await this.productRepository.getOneOrFail(id)
    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(productPostSchema))
  async create(@Body() data: ProductPostDto): Promise<CreateResponse<ProductOmit>> {
    const isTypeIdNotExist = await this.productTypeService.checkIsNotExists(data.type_id)

    if (isTypeIdNotExist) throw new HttpException('This type_id is not exist', HttpStatus.BAD_REQUEST)

    const productType = await this.productTypeRepository.getOneOrFail(data.type_id)
    const brand = await this.brandRepository.getOneOrFail(data.brandId)

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
      data: await this.productService.getSavedProduct(newProduct).then(), // TODO check is ".then()" needed
      message: 'Product has been successfully created',
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(productPutSchema))
  async update(@Param('id') id: number, @Body() data: ProductPutDto): Promise<ProductOmit> {
    await this.productRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<DeleteResponse> {
    await this.productRepository.deleteOrFail(id)
    return {
      message: `Product with ${id} has been deleted`,
    }
  }
}
