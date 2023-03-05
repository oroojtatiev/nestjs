import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes} from '@nestjs/common'
import {BrandRepository} from './brand.repository'
import {BrandService} from './brand.service'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'
import {brandSchema, brandPutSchema, BrandPostDto, BrandPutDto} from './brand.validation'
import {JwtAuthGuard} from '../../auth/jwt.guard'
import {prepareData} from '../../helpers/data'

@Controller('brand')
export class BrandController {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly brandService: BrandService,
  ) {}

  @Get()
  async getList(@Query('offset') offset: number, @Query('limit') limit: number) {
    return this.brandService.getList(offset, limit)
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const result = await this.brandRepository.getOneOrFail(id)
    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(brandSchema))
  async create(@Body() data: BrandPostDto) {
    const product = await this.brandRepository.save(data)
    return prepareData(product)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(brandPutSchema))
  async update(@Param('id') id: number, @Body() data: BrandPutDto) {
    await this.brandRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {
    await this.brandRepository.deleteOrFail(id)
    return {
      message: `Product type with ${id} has been deleted`,
    }
  }
}
