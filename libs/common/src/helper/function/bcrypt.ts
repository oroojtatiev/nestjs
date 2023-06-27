import * as bcrypt from 'bcrypt'

const saltRounds = 10

export async function getHash(value: string): Promise<string> {
  return bcrypt.hashSync(value, saltRounds)
}

export async function compareHash(value: string, hashValue: string): Promise<boolean> {
  return bcrypt.compare(value, hashValue)
}
