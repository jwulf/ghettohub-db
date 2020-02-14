import {GhettoDBOperationWithParameters} from '../main'
import {DatabaseDriver} from './db-driver'

export type GhettoDBOperationImpl = (
  config: Partial<GhettoDBOperationWithParameters>,
  db: DatabaseDriver
) => OperationOutcome

export const NotImplementedYet = (): OperationOutcome => ({
  error: 'Not Implemented yet',
  result: null
})

export interface OperationOutcome {
  error: any
  result: any
}
