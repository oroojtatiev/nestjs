import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {MailerService} from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendConfirmation(email: string, token: string) {
    const baseConfirmUrl = this.configService.get('APP_BASE_URL_SHOP')
    const confirmUrl = `${baseConfirmUrl}/user/verify?token=${token}`

    return this.mailerService.sendMail({
      to: email,
      from: `"No Reply" <${this.configService.get('AWS_SMTP_EMAIL')}>`,
      subject: 'Email confirmation',
      template: 'confirmation',
      context: {
        confirmUrl,
      },
    })
  }
}
