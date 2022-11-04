import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const confirmationSchema = Joi.object({
  email: Joi.string().email().required(),
})

export type confirmationDto = typeof Joi.extractType<typeof confirmationSchema>
