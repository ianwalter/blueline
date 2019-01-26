import drafter from 'drafter.js'
import { findAllNested } from '@ianwalter/find-nested'

export default function parse (input) {
  return new Promise((resolve, reject) => {
    drafter.parse(input, { type: 'ast' }, (err, { ast }) => {
      if (err) {
        reject(err)
      }

      // If request/response headers contain 'json', parse the body strings.
      const hasJsonBody = obj => obj.headers.some(h => h.value.includes('json'))
      let results = findAllNested(ast.resourceGroups, undefined, hasJsonBody)
      results.map(result => {
        try {
          result.body = JSON.parse(result.body)
        } catch (err) {
          // If there is a JSON.parse error, don't mutate the result.
          return result
        }
      })

      // Find all JSON schemas.
      results = findAllNested(ast.resourceGroups, undefined, obj => obj.schema)
      results.map(result => {
        try {
          const schema = JSON.parse(result.schema)
          const requiredIsArray = schema && Array.isArray(schema.required)
          if (requiredIsArray && schema.required.length === 0) {
            // Delete the JSON Schema because it was not generated properly and
            // is invalid.
            delete result.schema
          } else if (schema) {
            // De-duplicate required values since there is a bug in drafter.
            if (requiredIsArray) {
              schema.required = Array.from(new Set(schema.required))
            }

            // Save the parse schema back to the containing object so it's
            // easier to read.
            result.schema = schema
          }

          return result
        } catch (err) {
          // If there is a JSON.parse error, don't mutate the result.
          return result
        }
      })

      resolve(ast.resourceGroups)
    })
  })
}
