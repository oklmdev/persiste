import { v4 as uuid } from 'uuid'
export const getUuid = (): string => {
  return uuid()
}
