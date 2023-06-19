import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import * as Joi from '@hapi/joi'
import {AuthModule, DatabaseModule, RmqModule} from '@libs/common'
import {AUTH_SERVICE, MAIL_SERVICE} from '@libs/common/constant/microservice'
import {BrandModule} from './brand/brand.module'
import {ProductModule} from './product/product.module'
import {ProductTypeModule} from './productType/productType.module'
import {OrderModule} from './order/order.module'
import {UserModule} from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        APP_PORT_SHOP: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_QUEUE_SHOP: Joi.string().required(),
      }),
    }),
    AuthModule,
    DatabaseModule,
    UserModule,
    BrandModule,
    ProductModule,
    ProductTypeModule,
    OrderModule,
    RmqModule.register({name: AUTH_SERVICE}),
    RmqModule.register({name: MAIL_SERVICE}),
  ],
})
export class ShopModule {}
