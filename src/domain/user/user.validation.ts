import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const createUserSchema = Joi.object({
  firstname: Joi.string().max(15).required(),
  lastname: Joi.string().max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export type createUserDto = typeof Joi.extractType<typeof createUserSchema>
