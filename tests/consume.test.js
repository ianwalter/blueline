const { consume } = require('..')

const userJson = require('./fixtures/user.json')

test('consume can return a resource group by index', () => {
  const { json } = consume(userJson).group(0)
  expect(json.name).toEqual('User')
})

// test('consume can return a resource group by name', () => {
//   const { json } = consume(userJson).group('User')
//   expect(json.name).toEqual('Account')
// })

