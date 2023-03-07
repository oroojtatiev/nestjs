import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common'
import {mergeMap, Observable} from 'rxjs'
import {isEmptyObject} from '../../function/object'
import {ApiResponse} from '../../type/Response.type'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
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
      else data = await project.data || project

      return {
        status: status,
        data: data,
        message: message,
      }
    }))
  }
}
