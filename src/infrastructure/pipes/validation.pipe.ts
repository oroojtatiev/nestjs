import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common'
import * as Joi from '@hapi/joi'

@Injectable()
export class JoiValidationPipe implements PipeTransform {
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
