import {GhettoDBOperationImpl, OperationOutcome} from './utills'

export const drop: GhettoDBOperationImpl = (config, db): OperationOutcome => {
  const table: string = config.table as string
  db.dropTable(table)
  return {
    result: {
      table
    },
    error: null
  }
}
