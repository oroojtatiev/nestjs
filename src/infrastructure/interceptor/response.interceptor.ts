import {Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus} from '@nestjs/common'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {isEmptyObject} from '../../functions/helper'

export interface IResponse<T> {
  status: HttpStatus
  data?: T | undefined
  message?: string | undefined | string[]
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    const status = context.switchToHttp().getResponse().statusCode
    let message: string | undefined = undefined

    return next.handle().pipe(map(project => {
      if (project === undefined) return {status}

      if (project.message) message = project.message

      delete project.message

      if (isEmptyObject(project)) project = undefined

      return {
        status,
        data: project,
        message: message,
      }
    }))
  }
}
