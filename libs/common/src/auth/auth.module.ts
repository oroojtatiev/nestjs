import {Module} from '@nestjs/common'
import {AUTH_SERVICE} from '@libs/common/constant/microservice'
import {RmqModule} from '../rmq/rmq.module'

@Module({
  imports: [RmqModule.register({name: AUTH_SERVICE})],
  exports: [RmqModule],
})
export class AuthModule{}
