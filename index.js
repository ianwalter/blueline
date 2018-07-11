#!/usr/bin/env node

const { statSync, readdirSync, readFileSync, writeFileSync } = require('fs')
const { resolve, extname, basename } = require('path')

const drafter = require('drafter.js')
const meow = require('meow')
const { green } = require('chalk')

/**
 * Converts API Blueprint files to JSON files.
 * @param {String} input Path to API Blueprint file or directory containing API
 * Blueprint files.
 * @param {String} output Path to file or directory to output the generated JSON
 * file.
 */
function convert (input, output) {
  let files = [input]

  // If input is a directory, add the individual .apib files.
  const stats = statSync(input)
  if (stats.isDirectory()) {
    files = readdirSync(input)
      .filter(filename => filename.includes('.apib'))
      .map(filename => resolve(input, filename))
  }

  // Parse each API Blueprint file and output the result to a JSON file.
  files.forEach(file => {
    // Read the API Blueprint file's content.
    const content = readFileSync(file, 'utf8')

    // Parse the API Blueprint content using drafter.js.
    drafter.parse(content, { type: 'ast' }, function (err, { ast }) {
      if (err) {
        console.error(err)
        process.exit(1)
      }

      // Convert the resource groups to JSON.
      const json = JSON.stringify(ast.resourceGroups, null, 2)

      // Write the JSON to the JSON file.
      if (extname(output) === '.json') {
        writeFileSync(output, json)
      } else {
        writeFileSync(resolve(output, `${basename(file, '.apib')}.json`), json)
      }
    })
  })

  // Inform the user that the JSON file(s) have been generated.
  console.log(green(`\n  👍 Generated API Blueprint JSON!`))
}

/**
 * Consumer function to make working with the API Blueprint data easier.
 * @param {*} json API Blueprint data in JSON format.
 */
function consume (json) {
  this.json = json

  const find = (filter, prop) => {
    // Get namespaced or current JSON schema.
    const json = this.json[prop] || this.json

    // Filter the JSON schema using the filter parameter.
    if (Number.isInteger(filter)) {
      this.json = json[filter]
    } else if (typeof filter === 'string') {
      this.json = json.find(o => Object.values(o).includes(filter))
    } else if (typeof filter === 'function') {
      let values = Array.isArray(json) ? json : Object.values(json)
      this.json = values.find(filter)
    }

    // Return this instance so user can chain calls.
    return this
  }

  this.group = filter => find(filter)
  this.resource = filter => find(filter, 'resources')
  this.actions = filter => find(filter, 'actions')
  this.example = filter => find(filter, 'examples')
  this.request = filter => find(filter, 'requests')
  this.response = filter => find(filter, 'responses')

  return this
}

if (module.parent) {
  module.exports = { convert, consume }
} else {
  // Create a command-line interface to control the application.
  const cli = meow(`
    Usage
      peregrin <input?> <output?>
    Example
      ❯ npx peregrin src/docs docs

        👍 Generated API Blueprint JSON!

  `)

  // Call convert with the CLI input.
  convert(cli.input[0], cli.input[1])
}
