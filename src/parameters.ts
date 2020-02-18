import {GhettoDBOperationWithParameters, GhettoDBOperation} from './main'

export type KeyOfGhetto = keyof GhettoDBOperationWithParameters
const requiredParametersForOperation: {
  [key in GhettoDBOperation]: Array<KeyOfGhetto>
} = {
  INIT: [],
  DELETEONE: ['table', 'query', 'github_token'],
  DELETEMANY: ['table', 'query', 'github_token'],
  FINDONE: ['table', 'query'],
  FINDMANY: ['table', 'query'],
  UPSERT: ['table', 'record', 'github_token'],
  UPDATEONE: ['table', 'record', 'query', 'github_token'],
  UPDATEMANY: ['table', 'record', 'query', 'github_token'],
  DROPTABLE: ['table', 'github_token'],
  DROPDB: ['github_token']
}

export function missingParameters<T, K extends keyof T>(
  config: T,
  requiredParameters: Array<K>
): false | Array<K> {
  const missing = requiredParameters
    .map(p => ((config as any)[p] ? null : p))
    .filter(notEmpty)
  return missing.length > 0 ? missing : false
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export function resolveRequiredParameters(
  config: GhettoDBOperationWithParameters
):
  | {valid: false; missingKeys: Array<KeyOfGhetto>; config: null}
  | {valid: true; missingKeys: null; config: GhettoDBOperationWithParameters} {
  const missingKeys = missingParameters(
    config,
    requiredParametersForOperation[config.operation]
  )
  return missingKeys
    ? {valid: false, missingKeys, config: null}
    : {valid: true, missingKeys: null, config}
}
