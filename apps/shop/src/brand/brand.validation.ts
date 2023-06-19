import * as Joi from '@hapi/joi'
import 'joi-extract-type'

export const brandSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
})

export const brandPutSchema = brandSchema

export type BrandPostDto = typeof Joi.extractType<typeof brandSchema>
export type BrandPutDto = typeof Joi.extractType<typeof brandPutSchema>
