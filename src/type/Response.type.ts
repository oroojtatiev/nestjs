import {HttpStatus} from '@nestjs/common'

export interface CreateResponse<T> {
  data: T,
  message: string
}

export interface DeleteResponse {
  message: string
}

export interface ApiResponse<T> {
  status: HttpStatus
  data?: T
  message?: string | string[]
}
