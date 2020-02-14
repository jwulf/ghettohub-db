import {createQueryFilter} from '../src/operations/createQueryFilter'

test('QueryFilter', () => {
  const data = [
    {name: 'Joe Bloggs', address: 'The Dog House'},
    {name: 'Jane Doe', address: 'The White House'}
  ]
  const qf = createQueryFilter({address: 'The Dog House'})
  const res = data.filter(qf)
  expect(res.length).toBe(1)
  expect(res[0].name).toBe('Joe Bloggs')
})
