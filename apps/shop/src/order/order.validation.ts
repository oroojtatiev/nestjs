import * as Joi from '@hapi/joi'
import 'joi-extract-type'

const orderItem = Joi.object().keys({
  quantity: Joi.number().required(),
  productId: Joi.number().required(),
})

export const createOrderSchema = Joi.object().keys({
  transaction_id: Joi.string().required(),
  paymentType: Joi.string().valid('CREDIT_CARD', 'PAYPAL').required(), //TODO get from to enum
  products: Joi.array().items(orderItem).required(),
})

export const updateOrderSchema = createOrderSchema

export type OrderItemDto = typeof Joi.extractType<typeof orderItem>
export type CreateOrderDto = typeof Joi.extractType<typeof createOrderSchema>
export type UpdateOrderDto = typeof Joi.extractType<typeof updateOrderSchema>
