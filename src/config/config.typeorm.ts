import {DataSource, DataSourceOptions} from 'typeorm'
import {ConfigService} from '@nestjs/config'
import {config} from 'dotenv'

config()

const configService = new ConfigService()

export const dbConnectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'), // TODO make custom getter with number type
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + configService.get('TYPEORM_ENTITIES')], // TODO make custom getter with dirname
  migrations: [configService.get('TYPEORM_MIGRATIONS')],
}

export default new DataSource(dbConnectionOptions)
