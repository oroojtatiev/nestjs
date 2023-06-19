import {NestFactory} from '@nestjs/core'
import {ConfigService} from '@nestjs/config'
import {RmqOptions} from '@nestjs/microservices'
import {RmqService} from '@libs/common'
import {ExceptionFilter, ResponseInterceptor} from '@libs/common/helper'
import {MAIL_SERVICE} from '@libs/common/constant/microservice'
import {MailModule} from './mail.module'

async function bootstrap() {
  const app = await NestFactory.create(MailModule)
  const rmqService = app.get<RmqService>(RmqService)
  const configService = app.get(ConfigService)
  const rmqOptions = rmqService.getOptions(MAIL_SERVICE, true)

  app.connectMicroservice<RmqOptions>(rmqOptions)

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new ExceptionFilter(configService))

  await app.startAllMicroservices()
  await app.listen(configService.get('APP_PORT_MAIL'))
}

bootstrap()
