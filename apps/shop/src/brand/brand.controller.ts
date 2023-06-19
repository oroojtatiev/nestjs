import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes} from '@nestjs/common'
import {JwtGuard} from '@libs/common'
import {BodyValidatePipe} from '@libs/common/helper/pipe/validation.pipe'
import {Role, RoleGuard} from '@libs/common/role'
import {prepareData} from '@libs/common/helper/function/data'
import {BrandOmit} from '@libs/common/types/entityOmit.type'
import {MessageResponse} from '@libs/common/types/response.type'
import {BrandRepository} from './brand.repository'
import {BrandService} from './brand.service'
import {brandSchema, brandPutSchema, BrandPostDto, BrandPutDto} from './brand.validation'

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
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  @UsePipes(new BodyValidatePipe(brandSchema))
  async create(@Body() data: BrandPostDto) {
    const brand = await this.brandRepository.save(data)
    return {
      data: prepareData(brand),
      message: 'Brand has been successfully created',
    }
  }

  @Put(':id')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  @UsePipes(new BodyValidatePipe(brandPutSchema))
  async update(@Param('id') id: number, @Body() data: BrandPutDto): Promise<BrandOmit> {
    await this.brandRepository.update(id, data)
    return await this.getOne(id)
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RoleGuard(Role.Admin))
  async delete(@Param('id') id: number): Promise<MessageResponse> {
    await this.brandRepository.deleteOrFail(id)
    return {
      message: `Product type with ${id} has been deleted`,
    }
  }
}
