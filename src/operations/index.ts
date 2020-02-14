import {GhettoDBOperation} from '../main'
import {init} from './init'
import {GhettoDBOperationImpl} from './utills'
import {upsert} from './upsert'
import {find} from './find'
import {update} from './update'
import {deleteRecords} from './delete'
import {drop} from './droptable'

const Operations: {
  [key in GhettoDBOperation]: GhettoDBOperationImpl
} = {
  INIT: init,
  DELETEONE: deleteRecords,
  DELETEMANY: deleteRecords,
  DROPTABLE: drop,
  FINDONE: find,
  FINDMANY: find,
  UPSERT: upsert,
  UPDATEMANY: update,
  UPDATEONE: update
}

export default Operations
