import {Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus} from '@nestjs/common'
import {mergeMap, Observable} from 'rxjs'
import {isEmptyObject} from '../../functions/helper'

export interface IResponse<T> {
  status: HttpStatus
  data?: T
  message?: string | string[]
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    let status = context.switchToHttp().getResponse().statusCode
    let data = undefined
    let message = undefined

    return next.handle().pipe(mergeMap(async project => {
      if (project === undefined) return {status}

      if (project.status) status = project.status
      if (project.message) message = project.message

      delete project.status
      delete project.message

      if (Array.isArray(project)) data = await project
      else if (typeof project === 'string') data = project
      else if (isEmptyObject(project)) data = undefined
      else data = await project.data

      return {
        status: status,
        data: data,
        message: message,
      }
    }))
  }
}
