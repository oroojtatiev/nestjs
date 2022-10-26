import {Module} from '@nestjs/common'
import {AppConfigModule} from './config/config.module'
import {DatabaseModule} from './database/database.module'
import {AppController} from './app.controller'
import {AppService} from './app.service'

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
