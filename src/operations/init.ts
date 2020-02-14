import {GhettoDBOperationImpl, OperationOutcome} from './utills'

export const init: GhettoDBOperationImpl = (config): OperationOutcome => {
  const tables =
    config.tables
      ?.split(',')
      .map(s => s.trim())
      .reduce(
        (prev, current) => ({
          ...prev,
          [current]: current
        }),
        {}
      ) || {}
  return {
    error: false,
    result: {
      operations: {
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
      },
      tables
    }
  }
}
