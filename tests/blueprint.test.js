const Blueprint = require('../')

const userJson = require('./fixtures/user.json')

test('group can return a resource group by index', () => {
  const { json } = new Blueprint(userJson).group(0)
  expect(json.name).toEqual('User')
})

test('group can return a resource group by name', () => {
  const { json } = new Blueprint(userJson).group('User')
  expect(json.name).toEqual('User')
})

test('resource can return a resource by index', () => {
  const { json } = new Blueprint(userJson).group(0).resource(0)
  expect(json.name).toEqual('Account')
})

test('resource can return a resource by name', () => {
  const { json } = new Blueprint(userJson).group('User').resource('Account')
  expect(json.name).toEqual('Account')
})

test('body can return the parsed response body example', () => {
  const accountResponse = new Blueprint(userJson)
    .group('User')
    .resource('Account')
    .action('GET')
    .example(0)
    .response(0)
    .body()
  expect(accountResponse).toEqual({ id: 1, email: 'user@test.io' })
})

test('example can be used as base for request and response', () => {
  const example = new Blueprint(userJson)
    .group('User')
    .resource('Account')
    .action('PUT')
    .example(0)
  const request = example.request(0).body()
  const response = example.response(0).body()
  expect(request).toEqual({ id: 1, email: 'user@example.com' })
  expect(response).toEqual({ id: 1, email: 'user@example.com' })
})
