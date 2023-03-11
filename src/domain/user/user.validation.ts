import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const createUserSchema = Joi.object({
  firstname: Joi.string().max(15).required(),
  lastname: Joi.string().max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const updateUserSchema = Joi.object({
  firstname: Joi.string().max(15).required(),
  lastname: Joi.string().max(15).required(),
})

export type CreateUserDto = typeof Joi.extractType<typeof createUserSchema>
export type UpdateUserDto = typeof Joi.extractType<typeof updateUserSchema>
