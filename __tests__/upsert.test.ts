import {upsert} from '../src/operations/upsert'
import {DatabaseDriver} from '../src/operations/db-driver'
test('Can insert a new record', () => {
  const db = new DatabaseDriver('tmp')
  const record = upsert(
    {
      operation: 'UPSERT',
      basedir: 'tmp',
      table: 'customers',
      record: '{"name": "Jane Bloggs", "address": "Kanye\'s House"}',
      query: '{"name": "Jane Doe"}'
    },
    db
  )
  expect(record.result._id).not.toBeNull()
})

// '{"name": "Joe Bloggs", "address": "The White House", "_id": "38a87c99-f78f-46dc-937f-27ad91f6718e"}'
// {"name": "Jane Doe", "address": "The White House"}'
