import {join} from 'path'
import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {MailerModule} from '@nestjs-modules/mailer'
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import {JwtService} from '@nestjs/jwt'
import {MailController} from './mail.controller'
import {MailService} from './mail.service'
import {AuthService} from '../auth/auth.service'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.AWS_MAIL_ENDPOINT,
        secure: false,
        auth: {
          user: process.env.AWS_MAIL_USER,
          pass: process.env.AWS_MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" ${process.env.AWS_MAIL_FROM}`,
      },
      template: {
        dir: join(__dirname, 'template'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [ConfigService, MailService, AuthService, JwtService],
  exports: [MailService],
})
export class MailModule {}
