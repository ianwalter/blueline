#!/usr/bin/env node

const { statSync, readdirSync, readFileSync, writeFileSync } = require('fs')
const { resolve, extname, basename } = require('path')

const makeDir = require('make-dir')
const meow = require('meow')
const { green } = require('chalk')
const { parse } = require('.')

/**
 * Converts API Blueprint files to JSON files.
 * @param {String} input Path to API Blueprint file or directory containing API
 * Blueprint files.
 * @param {String} output Path to file or directory to output the generated JSON
 * file.
 */
async function convert (input, output) {
  let files = [input]

  const stats = statSync(input)
  if (stats.isDirectory()) {
    // If input is a directory, convert any .apib files within the directory.
    files = readdirSync(input)
      .filter(filename => filename.includes('.apib'))
      .map(filename => resolve(input, filename))

    // Make output directory and/or parent directories if necessary.
    await makeDir(output)
  }

  // Parse each API Blueprint file and output the result to a JSON file.
  files.forEach(async file => {
    // Read and parse the API Blueprint content using drafter.js.
    const resourceGroups = await parse(readFileSync(file, 'utf8'))

    // Convert the resource groups to JSON.
    const json = JSON.stringify(resourceGroups, null, 2)

    // Write the JSON to the JSON file.
    if (extname(output) === '.json') {
      writeFileSync(output, json)
    } else {
      writeFileSync(resolve(output, `${basename(file, '.apib')}.json`), json)
    }
  })

  // Inform the user that the JSON file(s) have been generated.
  console.log(green(`👍 Generated API Blueprint JSON!`))
}

// Create a command-line interface to control the application.
const cli = meow(`
  Usage
    blueline <input?> <output?>
  Example
    ❯ npx blueline src/docs docs

    👍 Generated API Blueprint JSON!

`)

// Call convert with the CLI input.
convert(cli.input[0], cli.input[1])
