import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {schema} from './config.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: schema,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
