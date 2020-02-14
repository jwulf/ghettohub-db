import {GhettoDBOperationImpl, OperationOutcome} from './utills'

export const init: GhettoDBOperationImpl = (): OperationOutcome => ({
  error: false,
  result: {
    DELETE: 'DELETE',
    FINDMANY: 'FINDMANY',
    INIT: 'INIT',
    UPSERT: 'UPSERT',
    FINDONE: 'FINDONE',
    DELETEONE: 'DELETEONE',
    DELETEMANY: 'DELETEMANY',
    UPDATEONE: 'UPDATEONE',
    UPDATEMANY: 'UPDATEMANY',
    DROPTABLE: 'DROPTABLE'
  }
})
