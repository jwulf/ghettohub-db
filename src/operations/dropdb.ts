import {GhettoDBOperationImpl, OperationOutcome} from './utills'

export const dropDB: GhettoDBOperationImpl = (config, db): OperationOutcome => {
  db.dropDB()
  return {
    result: {
      droppedDB: true
    },
    error: null
  }
}
