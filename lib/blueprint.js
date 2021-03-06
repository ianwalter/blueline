import { findNested } from '@ianwalter/find-nested'

export default class Blueprint {
  constructor (json) {
    this.json = json
  }

  find (filter = 0, prop) {
    let json = this.json

    // Filter the JSON schema using the filter parameter.
    if (Number.isInteger(filter)) {
      const found = findNested(json, prop) || json
      json = prop !== undefined ? found[filter] : found
    } else if (typeof filter === 'string') {
      const val = i => {
        if (Array.isArray(i)) {
          return i.find(val)
        } else if (i && typeof i === 'object') {
          return obj(i)
        } else {
          return i === filter
        }
      }
      const obj = i => Object.values(i).find(val)
      const descriminator = i => i && Array.isArray(i) && i.find(obj)
      json = (findNested(json, prop, descriminator) || json).find(obj)
    }

    // Return this instance so user can chain calls.
    return new Blueprint(json)
  }

  group (filter) {
    return this.find(filter)
  }

  resource (filter) {
    return this.find(filter, 'resources')
  }

  action (filter) {
    return this.find(filter, 'actions')
  }

  example (filter) {
    return this.find(filter, 'examples')
  }

  request (filter) {
    return this.find(filter, 'requests')
  }

  response (filter) {
    return this.find(filter, 'responses')
  }

  body () {
    return this.json.body
  }
}
