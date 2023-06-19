import {NestFactory} from '@nestjs/core'
import {RmqOptions} from '@nestjs/microservices'
import {ConfigService} from '@nestjs/config'
import {RmqService} from '@libs/common'
import {ExceptionFilter, ResponseInterceptor} from '@libs/common/helper'
import {SHOP_SERVICE} from '@libs/common/constant/microservice'
import {ShopModule} from './shop.module'

async function bootstrap() {
  const app = await NestFactory.create(ShopModule)
  const rmqService = app.get<RmqService>(RmqService)
  const configService = app.get(ConfigService)
  const rmqOptions = rmqService.getOptions(SHOP_SERVICE, true)

  app.connectMicroservice<RmqOptions>(rmqOptions)

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new ExceptionFilter(configService))

  await app.startAllMicroservices()
  await app.listen(configService.get('APP_PORT_SHOP'))
}

void bootstrap()
