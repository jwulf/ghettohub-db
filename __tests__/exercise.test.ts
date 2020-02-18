import Operations from '../src/operations'
import {DatabaseDriver} from '../src/operations/db-driver'

test('The whole thing', () => {
  const db = new DatabaseDriver('tmp')
  const table = 'customers'
  Operations.DROPTABLE({table}, db)
  expect(
    Operations.FINDMANY({table, operation: 'FINDMANY'}, db).result.found
  ).toBe(false)
  const joeBloggs = Operations.UPSERT(
    {
      table,
      record: JSON.stringify({
        name: 'Joe Bloggs',
        address: 'The White House'
      })
    },
    db
  )
  expect(joeBloggs.result._id).toBeTruthy()
  const searchByQuery1 = Operations.FINDONE(
    {
      table,
      operation: 'FINDONE',
      query: JSON.stringify({
        name: 'Joe Bloggs'
      })
    },
    db
  )
  expect(searchByQuery1.result.record._id).toBe(joeBloggs.result._id)
  const janeDoe = Operations.UPSERT(
    {
      table,
      record: JSON.stringify({
        name: 'Jane Doe',
        address: 'The Yellow House'
      })
    },
    db
  )
  expect(janeDoe.result._id).toBeTruthy()
  const findMany1 = Operations.FINDMANY({table, operation: 'FINDMANY'}, db)
  expect(findMany1.result.records.length).toBe(2)
  const kanye = Operations.UPSERT(
    {
      table,
      record: JSON.stringify({
        name: 'Kanye West',
        address: 'The White House'
      })
    },
    db
  )
  const findMany2 = Operations.FINDMANY(
    {
      table,
      operation: 'FINDMANY',
      query: JSON.stringify({
        address: 'The White House'
      })
    },
    db
  )
  expect(findMany2.result.records.length).toBe(2)
  const update1 = Operations.UPDATEONE(
    {
      table,
      operation: 'UPDATEONE',
      query: JSON.stringify({name: 'Joe Bloggs'}),
      record: JSON.stringify({address: 'The Yellow House'})
    },
    db
  )
  const searchMany = Operations.FINDMANY(
    {
      table,
      operation: 'FINDMANY',
      query: JSON.stringify({address: 'The Yellow House'})
    },
    db
  )
  expect(searchMany.result.records.length).toBe(2)
  const searchMany2 = Operations.FINDMANY(
    {
      table,
      operation: 'FINDMANY',
      query: JSON.stringify({address: 'The White House'})
    },
    db
  )
  expect(searchMany2.result.records.length).toBe(1)
  const kim = Operations.UPSERT(
    {
      table,
      operation: 'UPSERT',
      record: JSON.stringify({
        name: 'Kim Kardashian',
        address: 'The White House'
      })
    },
    db
  )
  const whiteHouseOccupants = Operations.FINDMANY(
    {
      table,
      operation: 'FINDMANY',
      query: JSON.stringify({
        address: 'The White House'
      })
    },
    db
  )
  expect(whiteHouseOccupants.result.records.length).toBe(2)
  const moveKimAndKanye = Operations.UPDATEMANY(
    {
      table,
      operation: 'UPDATEMANY',
      query: JSON.stringify({address: 'The White House'}),
      record: JSON.stringify({address: 'The Ghetto'})
    },
    db
  )
  const deleteMany = Operations.DELETEMANY(
    {
      table,
      query: JSON.stringify({address: 'The Ghetto'}),
      operation: 'DELETEMANY'
    },
    db
  )
  expect(deleteMany.result.count).toBe(2)
  expect(deleteMany.result.deletedRecordIds.includes(kanye.result._id)).toBe(
    true
  )
  expect(deleteMany.result.deletedRecordIds.includes(kim.result._id)).toBe(true)
  Operations.DROPTABLE({table}, db)
  expect(
    Operations.FINDMANY({operation: 'FINDMANY', table, query: '{}'}, db).result
      .count
  ).toBe(0)
  Operations.UPSERT(
    {record: JSON.stringify({name: 'Rick Rubin'}), table: 'party'},
    db
  )
  expect(
    Operations.FINDMANY(
      {operation: 'FINDMANY', table: 'party', query: '{}'},
      db
    ).result.count
  ).toBe(1)
  Operations.DROPDB({}, db)
  expect(
    Operations.FINDMANY(
      {operation: 'FINDMANY', table: 'party', query: '{}'},
      db
    ).result.count
  ).toBe(0)
})
