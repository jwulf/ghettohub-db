import {GhettoDBOperationImpl, OperationOutcome} from './utills'
import {createQueryFilter} from './createQueryFilter'

export const find: GhettoDBOperationImpl = (config, db): OperationOutcome => {
  const table: string = config.table as string
  const query: any = JSON.parse((config.query as string) || '{}')
  const operation: 'FINDONE' | 'FINDMANY' = config.operation as
    | 'FINDONE'
    | 'FINDMANY'

  const data = db.readTable(table)

  const queryFilter = createQueryFilter(query)
  const results = data.filter(queryFilter)
  switch (operation) {
    case 'FINDMANY': {
      return {
        result: {
          found: results.length > 0,
          count: results.length,
          records: results
        },
        error: null
      }
    }
    case 'FINDONE': {
      return {
        result: {
          found: results.length > 0,
          count: results.length,
          record: results.length > 0 ? results[0] : {}
        },
        error: null
      }
    }
  }
}
