import * as core from '@actions/core'
import path from 'path'
import {resolveRequiredParameters} from './parameters'
import Operations from './operations'
import {DatabaseDriver} from './operations/db-driver'
import {commit} from './operations/commit'

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
  tables?: string
  verbose?: boolean
  github_token?: string
}

async function run(): Promise<void> {
  const operation = core.getInput('operation', {
    required: true
  }) as GhettoDBOperation
  core.info(`Running ${operation} operation`)
  const parsedConfig = resolveRequiredParameters({
    operation,
    table: core.getInput('table'),
    record: core.getInput('record'),
    basedir: core.getInput('basedir') || 'db',
    query: core.getInput('query'),
    tables: core.getInput('tables'),
    verbose: core.getInput('verbose') == 'true'
  })

  core.info(`Basedir: ${path.resolve('./' + parsedConfig.config?.basedir)}`)

  if (!parsedConfig.valid) {
    return core.setFailed(
      `Missing required configuration keys for operation ${operation}: ${JSON.stringify(
        parsedConfig.missingKeys
      )}`
    )
  }
  const db = new DatabaseDriver(parsedConfig.config.basedir as string)

  if (parsedConfig.config.verbose) {
    core.info(`Operation: ${parsedConfig.config.operation}`)
    core.info(`Config: ${JSON.stringify(parsedConfig, null, 2)}`)
  }
  const operationResult = Operations[parsedConfig.config.operation](
    parsedConfig.config,
    db
  )
  if (parsedConfig.config.verbose) {
    core.info(`Result: ${JSON.stringify(operationResult.result, null, 2)}`)
  }

  if (operationResult.error) {
    core.setFailed(operationResult.error)
  }

  if (db.dirty) {
    core.info('Committing changes...')
    await commit()
  }
  core.info(JSON.stringify(operationResult.result))
  core.setOutput('result', JSON.stringify(operationResult.result))
}

run()
