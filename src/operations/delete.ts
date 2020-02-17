import {GhettoDBOperationImpl, OperationOutcome} from './utills'
import {createQueryFilter} from './createQueryFilter'

export const deleteRecords: GhettoDBOperationImpl = (
  config,
  db
): OperationOutcome => {
  const table: string = config.table as string
  const query: any = JSON.parse(config.query as string)
  const operation: 'DELETEONE' | 'DELETEMANY' = config.operation as
    | 'DELETEONE'
    | 'DELETEMANY'
  let data = db.readTable(table)

  const queryFilter = createQueryFilter(query)

  const candidates = data.filter(queryFilter).map(rec => rec._id)

  const recordsToDelete =
    operation === 'DELETEMANY'
      ? candidates
      : candidates.length > 0
      ? [candidates[0]]
      : []

  data = data.map(rec =>
    recordsToDelete.includes(rec._id) ? {...rec, __delete: true} : rec
  )

  db.flushTable(table, data)

  return {
    error: null,
    result: {
      count: recordsToDelete.length,
      deletedRecordIds: recordsToDelete
    }
  }
}
