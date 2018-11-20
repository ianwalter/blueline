const Blueprint = require('../')

const json = require('./fixtures/user.json')

test('group can return a resource group by index', () => {
  const blueprint = new Blueprint(json).group(0)
  expect(blueprint.json.name).toEqual('User')
})

test('group can return a resource group by name', () => {
  const blueprint = new Blueprint(json).group('User')
  expect(blueprint.json.name).toEqual('User')
})

test('resource can return a resource by index', () => {
  const blueprint = new Blueprint(json).group().resource(0)
  expect(blueprint.json.name).toEqual('Account')
})

test('resource can return a resource by name', () => {
  const blueprint = new Blueprint(json).group('User').resource('Account')
  expect(blueprint.json.name).toEqual('Account')
})

test('body can return the parsed response body example', () => {
  const { body } = new Blueprint(json)
    .group('User')
    .resource('Account')
    .action('GET')
    .example(0)
    .response()
    .json
  expect(body).toEqual({ id: 1, email: 'user@test.io' })
})

test('example can be used as base for request and response', () => {
  const example = new Blueprint(json)
    .group('User')
    .resource('Account')
    .action('PUT')
    .example(0)
  const req = example.request(0).body()
  const res = example.response(0).body()
  expect(req).toEqual({ id: 1, email: 'user@example.com' })
  expect(res).toEqual({ id: 1, email: 'user@example.com' })
})

test('request can be returned by name', () => {
  const req = new Blueprint(json).request('Successful Update').body()
  expect(req).toEqual({ id: 1, email: 'user@example.com' })
})

test('example can be returned by request name', () => {
  const invalidEmail = new Blueprint(json).example('Invalid Email')
  const example = json[0].resources[0].actions[1].examples[1]
  expect(invalidEmail.json).toEqual(example)
  expect(invalidEmail.request().body()).toEqual(example.requests[0].body)
  expect(invalidEmail.response().body()).toEqual(example.responses[0].body)
})
