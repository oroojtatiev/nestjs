import * as Joi from '@hapi/joi'
import 'joi-extract-type'
import {Role} from '../../role/roles.enum'

export const createUserSchema = Joi.object({
  firstname: Joi.string().max(15).required(),
  lastname: Joi.string().max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const updateUserByUserSchema = Joi.object({
  firstname: Joi.string().max(15).required(),
  lastname: Joi.string().max(15).required(),
})

export const updateUserByAdminSchema = Joi.object({
  firstname: Joi.string().max(15).required(),
  lastname: Joi.string().max(15).required(),
  email: Joi.string().email().required(),
  roles: Joi.array().items(Joi.string().valid(...Object.values(Role))).required(),
})

export type CreateUserDto = typeof Joi.extractType<typeof createUserSchema>
export type UpdateUserByUserDto = typeof Joi.extractType<typeof updateUserByUserSchema>
export type UpdateUserByAdminDto = typeof Joi.extractType<typeof updateUserByAdminSchema>
