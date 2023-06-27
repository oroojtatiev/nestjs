import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ConfigModule, ConfigService} from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        database: configService.get('DB_NAME') as string,
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        entities: [__dirname + configService.get('TYPEORM_ENTITIES')],
        autoLoadEntities: true,
        synchronize: String(configService.get('TYPEORM_DB_SYNC')) === 'true',
      }),
    }),
  ],
})
export class DatabaseModule {}
