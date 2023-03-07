import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes} from '@nestjs/common'
import {BrandRepository} from './brand.repository'
import {BrandService} from './brand.service'
import {BodyValidatePipe} from '../../infrastructure/pipes/validation.pipe'
import {brandSchema, brandPutSchema, BrandPostDto, BrandPutDto} from './brand.validation'
import {JwtAuthGuard} from '../../auth/jwt.guard'
import {prepareData} from '../../function/data'
import {BrandOmit} from '../../type/EntityOmit.type'
import {DeleteResponse} from '../../type/Response.type'

@Controller('brand')
export class BrandController {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly brandService: BrandService,
  ) {}

  @Get()
  async getList(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<BrandOmit[]> {
    return this.brandService.getList(offset, limit)
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<BrandOmit> {
    const result = await this.brandRepository.getOneOrFail(id)
    return prepareData(result)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(brandSchema))
  async create(@Body() data: BrandPostDto) { // TODO need to type
    const brand = await this.brandRepository.save(data)
    return {
      data: prepareData(brand),
      message: 'Brand has been successfully created',
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new BodyValidatePipe(brandPutSchema))
  async update(@Param('id') id: number, @Body() data: BrandPutDto): Promise<BrandOmit> {
    await this.brandRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<DeleteResponse> {
    await this.brandRepository.deleteOrFail(id)
    return {
      message: `Product type with ${id} has been deleted`,
    }
  }
}
