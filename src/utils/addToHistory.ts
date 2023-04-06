import { postgres } from '../postgres'
import { getUuid } from './getUuid'

type Literal = boolean | null | number | string
type JSON = Literal | { [key: string]: JSON } | JSON[]

export type Fact<Type extends string = string, Details extends JSON = any> = {
  id: string
  type: Type
  occurredAt: Date
  details: Details
}

export const makeFact =
  <FactType extends Fact>(type: ExtractType<FactType>) =>
  (details: ExtractDetails<FactType>) => ({
    id: getUuid(),
    occurredAt: new Date(),
    type,
    details,
  })

export const addToHistory = async ({ id, type, details, occurredAt }: Fact) => {
  await postgres.query('INSERT INTO history (id, type, details, "occurredAt") VALUES ($1, $2, $3, $4)', [
    id,
    type,
    details,
    new Date(occurredAt),
  ])
}

export const createHistoryTable = async () => {
  return postgres.query(
    `CREATE TABLE IF NOT EXISTS history (id UUID PRIMARY KEY, type VARCHAR(255) NOT NULL, details JSONB, "occurredAt" TIMESTAMPTZ NOT NULL);`
  )
}

// Some type utils
type ExtractType<FactType extends Fact> = FactType extends Fact<infer Type, any> ? Type : never

type ExtractDetails<FactType extends Fact> = FactType extends Fact<string, infer Details> ? Details : never
