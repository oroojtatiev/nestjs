import {Body, Controller, Inject, Post, UsePipes} from '@nestjs/common'
import {ClientProxy, MessagePattern} from '@nestjs/microservices'
import {map, mergeMap} from 'rxjs'
import {BodyValidatePipe} from '@libs/common/helper/pipe/validation.pipe'
import {AUTH_SERVICE, messagePattern} from '@libs/common/constant/microservice'
import {SendConfirmation} from '@libs/common/types/mail.type'
import {MailService} from './mail.service'
import {ConfirmationDto, confirmationSchema} from './mail.validation'

@Controller('mail')
export class MailController {
  constructor(
    private mailService: MailService,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) {}
  @MessagePattern(messagePattern.mail.sendConfirmation)
  async sendConfirmation({email, token}: SendConfirmation) {
    return this.mailService.sendConfirmation(email, token)
  }

  @Post('confirmation/resend')
  @UsePipes(new BodyValidatePipe(confirmationSchema))
  async resendConfirmation(@Body() body: ConfirmationDto) {
    return this.authClient
      .send(messagePattern.auth.generateEmailToken, {email: body.email})
      .pipe(
        mergeMap(token => this.mailService.sendConfirmation(body.email, token)),
        map(() => ({
          message: 'The confirmation email has been sent',
        }))
      )
  }
}
