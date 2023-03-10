import {CanActivate, ExecutionContext, Type, mixin} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {Role} from './role.enum'
import {RequestWithUser} from '../auth/auth.interface'

export const RoleGuard = (role: Role): Type<CanActivate> => {
  return class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<RequestWithUser>()
      const user = request.user
      return user?.role === role
    }
  }
}
