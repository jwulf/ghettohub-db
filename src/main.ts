import * as core from '@actions/core'

import {resolveRequiredParameters} from './parameters'
import Operations from './operations'
import {DatabaseDriver} from './operations/db-driver'

export type GhettoDBOperation =
  | 'FINDONE'
  | 'FINDMANY'
  | 'UPSERT'
  | 'DELETEONE'
  | 'DELETEMANY'
  | 'INIT'
  | 'UPDATEONE'
  | 'UPDATEMANY'
  | 'DROPTABLE'

export interface GhettoDBOperationWithParameters {
  operation: GhettoDBOperation
  table?: string
  record?: string
  basedir?: string
  query?: string
}

async function run(): Promise<void> {
  const operation = core.getInput('operation', {
    required: true
  }) as GhettoDBOperation
  const parsedConfig = resolveRequiredParameters({
    operation,
    table: core.getInput('table'),
    record: core.getInput('record'),
    basedir: core.getInput('basedir') || 'db',
    query: core.getInput('query')
  })
  if (!parsedConfig.valid) {
    return core.setFailed(
      `Missing required configuration keys for operation ${operation}: ${JSON.stringify(
        parsedConfig.missingKeys
      )}`
    )
  }
  const db = new DatabaseDriver(parsedConfig.config.basedir as string)

  const operationResult = await Operations[parsedConfig.config.operation](
    parsedConfig.config,
    db
  )
  if (operationResult.result) {
    core.info(JSON.stringify(operationResult.result))
    core.setOutput('result', JSON.stringify(operationResult.result))
  }
  if (operationResult.error) {
    core.setOutput('error', JSON.stringify(operationResult.error))
  }
}

run()
