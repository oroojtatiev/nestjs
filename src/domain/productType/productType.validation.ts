import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const productTypePostSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
})

export const productTypePutSchema = productTypePostSchema

export type ProductTypePostDto = typeof Joi.extractType<typeof productTypePostSchema>
export type ProductTypePutDto = typeof Joi.extractType<typeof productTypePutSchema>
