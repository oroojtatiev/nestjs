import {Module} from '@nestjs/common'
import {AppConfigModule} from './config/config.module'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {DatabaseModule} from './database/database.module'
import {AuthModule} from './auth/auth.module'
import {MailModule} from './mail/mail.module'
import {UserModule} from './domain/user/user.module'
import {BrandModule} from './domain/brand/brand.module'
import {ProductModule} from './domain/product/product.module'
import {ProductTypeModule} from './domain/productType/productType.module'
import {OrderModule} from './domain/order/order.module'

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    MailModule,
    UserModule,
    BrandModule,
    ProductModule,
    ProductTypeModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
