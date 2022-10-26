import * as Joi from 'joi'

export const schema = Joi.object({
  NODE_ENV: Joi.string().required().valid('development', 'production'),
  APP_PORT: Joi.number().required(),
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SYNC: Joi.string().required().valid('true', 'false'),
  AUTH_JWT_SECRET: Joi.string().required(),
  AUTH_JWT_TOKEN_EXPIRES: Joi.string().required(),
})
