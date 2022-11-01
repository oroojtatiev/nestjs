import * as Joi from 'joi'

export const schema = Joi.object({
  NODE_ENV: Joi.string().required().valid('development', 'production'),
  APP_PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  TYPEORM_ENTITIES: Joi.string().required(),
  TYPEORM_SYNC: Joi.string().required().valid('true', 'false'),
  AUTH_JWT_SECRET: Joi.string().required(),
  AUTH_JWT_TOKEN_EXPIRES: Joi.string().required(),
  PGADMIN_LISTEN_PORT: Joi.string().required(),
  PGADMIN_DEFAULT_EMAIL: Joi.string().required(),
  PGADMIN_DEFAULT_PASSWORD: Joi.string().required(),
})
