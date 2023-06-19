import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import {AUTH_SERVICE} from '@libs/common/constant/microservice'
import {RmqModule} from '../rmq/rmq.module'

@Module({
  imports: [RmqModule.register({name: AUTH_SERVICE})],
  exports: [RmqModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*')
  }
}
