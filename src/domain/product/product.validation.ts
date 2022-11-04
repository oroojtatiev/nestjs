import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const productPostSchema = Joi.object({
  typeId: Joi.number().integer().required(),
  serial: Joi.string().alphanum().min(5).max(15).required(),
  title: Joi.string().min(5).max(55).required(),
  scale: Joi.string().min(3).max(6),
  weight: Joi.number().integer().min(10).max(99999).required(),
  image: Joi.string().max(55),
  price: Joi.number().min(0).max(99999).required(),
  inStock: Joi.boolean(),
  isPublished: Joi.boolean(),
})

export const productPutSchema = productPostSchema

export type ProductPostDto = typeof Joi.extractType<typeof productPostSchema>
export type ProductPutDto = typeof Joi.extractType<typeof productPutSchema>
