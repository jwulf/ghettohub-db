import {GhettoDBOperationImpl, OperationOutcome} from './utills'
import {v4 as uuid} from 'uuid'
import {createQueryFilter} from './createQueryFilter'
import {JSONDoc} from './db-driver'

/**
 * Will insert a new record if no existing match is found.
 * Will match on _id, unless a query is specified - in which it
 * will update the first match, or insert a new record.
 *
 */
export const upsert: GhettoDBOperationImpl = (config, db): OperationOutcome => {
  const {table: tablename, record} = config

  let jsonRecord: JSONDoc
  try {
    jsonRecord = JSON.parse(record as string)
  } catch (e) {
    return {
      error: `Could not parse record to JSON: ${e.message}`,
      result: null
    }
  }

  const query =
    config.query && config.query !== '' ? JSON.parse(config.query) : undefined

  const queryFilter = query
    ? createQueryFilter(query)
    : createQueryFilter({_id: jsonRecord._id})

  let table = db.readTable(tablename as string)

  let newRecord: JSONDoc
  const result: JSONDoc = {}
  if (!jsonRecord._id && !query) {
    newRecord = createNewRecord(jsonRecord)
    table.push(newRecord)
  } else {
    const existingRecord = table.filter(queryFilter)
    if (existingRecord.length === 0) {
      newRecord = createNewRecord(jsonRecord)
      table.push(newRecord)
      result.new = true
      result.update = false
    } else {
      newRecord = {
        ...jsonRecord,
        _updated: new Date().toString()
      }
      table = table.map(rec =>
        rec._id === existingRecord[0]._id ? newRecord : rec
      )
      result.update = true
      result.new = false
    }
  }

  db.flushTable(tablename as string, table)

  return {
    error: null,
    result: newRecord
  }
}

function createNewRecord(jsonRecord: JSONDoc): JSONDoc {
  return {
    ...jsonRecord,
    _updated: new Date().toString(),
    _id: uuid()
  }
}
