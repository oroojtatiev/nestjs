import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common'
import * as Joi from '@hapi/joi'

@Injectable()
export class BodyValidatePipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: object | string, metadata: ArgumentMetadata) {
    if (typeof value === 'string') return value

    const result = this.schema.validate(value, {abortEarly: false})

    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message)
      throw new BadRequestException(errorMessages)
    }

    return value
  }
}

@Injectable()
export class QueryValidatePipe implements PipeTransform {
  constructor(private params: string[]) {}

  transform(value: object | string, metadata: ArgumentMetadata) {
    if (typeof value === 'string') return value
    
    const errors = []

    const clientParams = Object.keys(value)

    clientParams.forEach(param => {
      if (!this.params.includes(param)) {
        errors.push(`"${param}" is not allowed`)
      }
    })

    this.params.forEach(param => {
      if (!clientParams.includes(param)) {
        errors.push(`"${param}" is required`)
      }
    })

    if (errors.length > 0) {
      throw new BadRequestException(errors)
    }

    return value
  }
}
