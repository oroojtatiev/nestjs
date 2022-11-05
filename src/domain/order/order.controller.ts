import {Controller, Post, Body, Get, Query, Param, Delete, Put, UseGuards} from '@nestjs/common'
import {JwtAuthGuard} from '../../auth/jwt.guard'

@Controller('orders')
export class OrderController {
  constructor() {}

  @Get()
  async getList(@Query('offset') offset: number, @Query('limit') limit: number) {}

  @Get(':id')
  async getOne(@Param('id') id: number) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any) {} // TODO must be typed

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() data: any) {} // TODO must be typed

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {}
}
