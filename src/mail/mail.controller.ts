import {Body, Controller, Post, UsePipes} from '@nestjs/common'
import {AuthService} from '../auth/auth.service'
import {MailService} from './mail.service'
import {JoiValidationPipe} from '../infrastructure/pipes/validation.pipe'
import {confirmationSchema} from './mail.validation'

@Controller('mail')
export class MailController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Post('confirm')
  @UsePipes(new JoiValidationPipe(confirmationSchema))
  async resendConfirmation(@Body() body: any) {
    const token = await this.authService.generateToken(body.email)

    await this.mailService.sendConfirmation(body.email, token)

    return {
      message: 'The confirmation email has been sent',
    }
  }
}
