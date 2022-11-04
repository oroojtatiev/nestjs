import {Body, Controller, Post, UsePipes} from '@nestjs/common'
import {AuthService} from '../auth/auth.service'
import {MailService} from './mail.service'
import {BodyValidatePipe} from '../infrastructure/pipes/validation.pipe'
import {ConfirmationDto, confirmationSchema} from './mail.validation'

@Controller('mail')
export class MailController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Post('confirm')
  @UsePipes(new BodyValidatePipe(confirmationSchema))
  async resendConfirmation(@Body() body: ConfirmationDto) {
    const token = await this.authService.generateToken(body.email)

    await this.mailService.sendConfirmation(body.email, token)

    return {
      message: 'The confirmation email has been sent',
    }
  }
}
