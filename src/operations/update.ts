import {GhettoDBOperationImpl, OperationOutcome} from './utills'
import {createQueryFilter} from './createQueryFilter'
import {JSONDoc} from './db-driver'

export const update: GhettoDBOperationImpl = (config, db): OperationOutcome => {
  const table: string = config.table as string
  const query: any = JSON.parse(config.query as string)
  const updatePartial: JSONDoc = JSON.parse(config.record as string)
  const operation: 'UPDATEONE' | 'UPDATEMANY' = config.operation as
    | 'UPDATEONE'
    | 'UPDATEMANY'

  let data = db.readTable(table)

  const queryFilter = createQueryFilter(query)

  const candidates = data.filter(queryFilter).map(rec => rec._id)

  const recordsToUpdate =
    operation === 'UPDATEMANY'
      ? candidates
      : candidates.length > 0
      ? [candidates[0]]
      : []

  data = data.map(rec =>
    recordsToUpdate.includes(rec._id)
      ? {...rec, ...updatePartial, __dirty: true}
      : rec
  )

  db.flushTable(table, data)

  return {
    error: null,
    result: {
      updatedCount: recordsToUpdate.length,
      updatedRecordIds: recordsToUpdate
    }
  }
}
