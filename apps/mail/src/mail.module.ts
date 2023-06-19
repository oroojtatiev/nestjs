import {join} from 'path'
import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {MailerModule} from '@nestjs-modules/mailer'
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import * as Joi from '@hapi/joi'
import {AuthModule, RmqModule} from '@libs/common'
import {AUTH_SERVICE, SHOP_SERVICE} from '@libs/common/constant/microservice'
import {MailController} from './mail.controller'
import {MailService} from './mail.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        APP_PORT_MAIL: Joi.number().required(),
        APP_BASE_URL_SHOP: Joi.string().required(),
        AWS_SMTP_ENDPOINT: Joi.string().required(),
        AWS_SMTP_USERNAME: Joi.string().required(),
        AWS_SMTP_PASSWORD: Joi.string().required(),
        AWS_SMTP_EMAIL: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_QUEUE_MAIL: Joi.string().required(),
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.AWS_SMTP_ENDPOINT,
        secure: false,
        auth: {
          user: process.env.AWS_SMTP_USERNAME,
          pass: process.env.AWS_SMTP_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" ${process.env.AWS_SMTP_EMAIL}`,
      },
      template: {
        dir: join(__dirname, 'template'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    RmqModule.register({name: AUTH_SERVICE}),
    RmqModule.register({name: SHOP_SERVICE}),
    AuthModule,
  ],
  controllers: [MailController],
  providers: [ConfigService, MailService],
})
export class MailModule {}
