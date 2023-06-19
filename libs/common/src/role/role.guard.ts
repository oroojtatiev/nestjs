import {Reflector} from '@nestjs/core'
import {CanActivate, ExecutionContext, Type} from '@nestjs/common'
import {Request} from 'express'
import {Role} from './roles.enum'
import {ROLES_KEY} from './role.constant'

export const RoleGuard = (role: Role): Type<CanActivate> => {
  return class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const {user} = context.switchToHttp().getRequest<Request>()
      return user?.[ROLES_KEY].includes(role)
    }
  }
}
