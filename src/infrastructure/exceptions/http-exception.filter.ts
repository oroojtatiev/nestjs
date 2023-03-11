import {ExceptionFilter, Catch, ArgumentsHost, HttpException, NotFoundException, HttpStatus} from '@nestjs/common'
import {Response} from 'express'
import {EntityNotFoundError} from 'typeorm'
import {ConfigService} from '@nestjs/config'

interface ExceptionResponse {
  statusCode: number
  message: string[]
  error: string
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  // private readonly logger = new Logger(HttpExceptionFilter.name) // TODO implement logging

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof NotFoundException) {
      const {statusCode, error} = exception.getResponse() as ExceptionResponse
      return response
        .status(statusCode)
        .json({status: statusCode, message: error})
    }

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as ExceptionResponse
      const status = exception.getStatus()
      const message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message

      return response
        .status(status)
        .json({status: status, message: message})
    }

    if (exception instanceof EntityNotFoundError) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({status: HttpStatus.NOT_FOUND, message: exception.message})
    }

    if (this.configService.get('NODE_ENV') === 'development' && exception instanceof Error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: exception.stack,
        })
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
  }
}
