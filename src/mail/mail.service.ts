import {MailerService} from '@nestjs-modules/mailer'
import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendConfirmation(email: string, token: string) {
    const baseConfirmUrl = this.configService.get('AUTH_CONFIRM_URL')
    const confirmUrl = `${baseConfirmUrl}?token=${token}`

    await this.mailerService.sendMail({
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
