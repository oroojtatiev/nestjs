import {NestFactory} from '@nestjs/core'
import {ConfigService} from '@nestjs/config'
import {RmqOptions} from '@nestjs/microservices'
import * as cookieParser from 'cookie-parser'
import {RmqService} from '@libs/common'
import {ExceptionFilter, ResponseInterceptor} from '@libs/common/helper'
import {AUTH_SERVICE} from '@libs/common/constant/microservice'
import {AuthModule} from './auth.module'

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)
  const rmqService = app.get<RmqService>(RmqService)
  const configService = app.get(ConfigService)
  const rmqOptions = rmqService.getOptions(AUTH_SERVICE, true)

  app.connectMicroservice<RmqOptions>(rmqOptions)

  app.use(cookieParser())

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new ExceptionFilter(configService))

  await app.startAllMicroservices()
  await app.listen(configService.get('APP_PORT_AUTH'))
}

void bootstrap()
