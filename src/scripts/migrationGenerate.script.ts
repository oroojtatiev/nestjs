import {config} from 'dotenv'
import {exec} from 'child_process'
import {ConfigService} from '@nestjs/config'

config()

const configService = new ConfigService()

const argument = process.argv[2]
const migrationDir = configService.get('TYPEORM_MIGRATIONS_DIR')
const baseCommand = `pnpm run typeorm migration:generate ${migrationDir}`

if (argument) {
  const command = baseCommand + argument;

  (() => exec(command, (error, stdout, stderr) => {
    if (error !== null) {
      console.error(stderr)
    }
    console.info(stdout)
  }))()
} else {
  console.error('ERROR: You need to pass migration name as argument')
}
