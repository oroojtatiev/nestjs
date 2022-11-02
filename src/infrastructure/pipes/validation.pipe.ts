import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common'
import {ObjectSchema} from 'joi'

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const result = this.schema.validate(value, {abortEarly: false})

    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message)
      throw new BadRequestException(errorMessages)
    }

    return value
  }
}
