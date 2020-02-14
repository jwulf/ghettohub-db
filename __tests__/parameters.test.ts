import {missingParameters, resolveRequiredParameters} from '../src/parameters'
import {GhettoDBOperationWithParameters} from '../src/main'

test('missingParameters', () => {
  const validOperation: GhettoDBOperationWithParameters = {
    operation: 'UPSERT',
    table: 'customers',
    record: '{"name": "something"}'
  }
  expect(missingParameters(validOperation, ['table', 'record'])).toBe(false)
  const operationMissingRequiredParameters: GhettoDBOperationWithParameters = {
    operation: 'DELETEONE',
    table: 'customers'
  }
  const missing = missingParameters(operationMissingRequiredParameters, [
    'table',
    'record',
    'query'
  ]) as string[]
  expect(missing.includes('record')).toBe(true)
  expect(missing.length).toBe(2)
})

test('resolveRequiredParameters', () => {
  const validUpsertOperation: GhettoDBOperationWithParameters = {
    operation: 'UPSERT',
    table: 'customers',
    record: '{"name": "something"}'
  }
  const parsed = resolveRequiredParameters(validUpsertOperation)
  expect(parsed.valid).toBe(true)
  if (parsed.valid) {
    expect(parsed.config.table).toBe('customers')
  }
  const invalidOperationDelete: GhettoDBOperationWithParameters = {
    operation: 'DELETEONE',
    table: 'customers'
  }
  const invalid = resolveRequiredParameters(invalidOperationDelete)
  expect(invalid.valid).toBe(false)
})
