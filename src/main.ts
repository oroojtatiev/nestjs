import {NestFactory} from '@nestjs/core'
import {ConfigService} from '@nestjs/config'
import {AppModule} from './app.module'
import {AppExceptionFilter} from './infrastructure/exception/http-exception.filter'
import {ResponseInterceptor} from './infrastructure/interceptor/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new AppExceptionFilter())

  await app.listen(configService.get('APP_PORT'))
}

void bootstrap()
