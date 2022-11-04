import * as Joi from '@hapi/joi'

export const schema = Joi.object({
  NODE_ENV: Joi.string().required().valid('development', 'production'),
  APP_PORT: Joi.number().required(),
  APP_BASE_URI: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  TYPEORM_ENTITIES: Joi.string().required(),
  TYPEORM_SYNC: Joi.string().required().valid('true', 'false'),
  AUTH_JWT_SECRET: Joi.string().required(),
  AUTH_JWT_TOKEN_EXPIRE: Joi.string().required(),
  AUTH_CONFIRM_URL: Joi.string().required(),
  AWS_MAIL_ENDPOINT: Joi.string().required(),
  AWS_MAIL_USER: Joi.string().required(),
  AWS_MAIL_PASSWORD: Joi.string().required(),
  AWS_MAIL_FROM: Joi.string().required(),
})
