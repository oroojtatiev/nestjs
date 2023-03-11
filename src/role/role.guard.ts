import {CanActivate, ExecutionContext, Type} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {Role} from './roles.enum'
import {ROLES_KEY} from './role.constant'
import {RequestWithUser} from '../auth/auth.interface'

export const RoleGuard = (role: Role): Type<CanActivate> => {
  return class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const {user} = context.switchToHttp().getRequest<RequestWithUser>()
      return user?.[ROLES_KEY].includes(role)
    }
  }
}
