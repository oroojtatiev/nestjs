import {Injectable} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'
import {strategy} from '@libs/common/auth/constant'

@Injectable()
export class RefreshTokenGuard extends AuthGuard(strategy.jwtRefresh) {}
