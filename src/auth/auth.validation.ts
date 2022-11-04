import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export type LoginDto = typeof Joi.extractType<typeof loginSchema>
