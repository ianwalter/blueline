import test from 'ava'
import { Blueprint } from '..'
import json from './fixtures/user.json'

test('group can return a resource group by index', t => {
  const blueprint = new Blueprint(json).group(0)
  t.is(blueprint.json.name, 'User')
})

test('group can return a resource group by name', t => {
  const blueprint = new Blueprint(json).group('User')
  t.is(blueprint.json.name, 'User')
})

test('resource can return a resource by index', t => {
  const blueprint = new Blueprint(json).group().resource(0)
  t.is(blueprint.json.name, 'Account')
})

test('resource can return a resource by name', t => {
  const blueprint = new Blueprint(json).group('User').resource('Account')
  t.is(blueprint.json.name, 'Account')
})

test('body can return the parsed response body example', t => {
  const { body } = new Blueprint(json)
    .group('User')
    .resource('Account')
    .action('GET')
    .example(0)
    .response()
    .json
  t.deepEqual(body, { id: 1, email: 'user@test.io' })
})

test('example can be used as base for request and response', t => {
  const example = new Blueprint(json)
    .group('User')
    .resource('Account')
    .action('PUT')
    .example(0)
  const req = example.request(0).body()
  const res = example.response(0).body()
  t.deepEqual(req, { id: 1, email: 'user@example.com' })
  t.deepEqual(res, { id: 1, email: 'user@example.com' })
})

test('request can be returned by name', t => {
  const req = new Blueprint(json).request('Successful Update').body()
  t.deepEqual(req, { id: 1, email: 'user@example.com' })
})

test('example can be returned by request name', t => {
  const invalidEmail = new Blueprint(json).example('Invalid Email')
  const example = json[0].resources[0].actions[1].examples[1]
  t.is(invalidEmail.json, example)
  t.is(invalidEmail.request().body(), example.requests[0].body)
  t.is(invalidEmail.response().body(), example.responses[0].body)
})
