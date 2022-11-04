import {Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus} from '@nestjs/common'
import {mergeMap, Observable} from 'rxjs'

export interface IResponse<T> {
  status: HttpStatus
  data?: T | undefined
  message?: string | undefined | string[]
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
      if (project.data) data = await project.data
      if (project.message) message = project.message

      return {
        status: status,
        data: data,
        message: message,
      }
    }))
  }
}
