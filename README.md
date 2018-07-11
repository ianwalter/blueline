# Peregrin
> Toolkit for converting API Blueprint files to JSON and consuming that JSON


## CLI Usage

## Usage

Example of generating API Blueprint JSON files using the CLI:

```console
npx peregrin src/docs docs

  👍 Generated API Blueprint JSON to docs!

```

Example of consuming an API Blueprint JSON file and asserting that one of the
request properties has a certain value:

```js
const { consume } = require('@ianwalter/peregrin')

const accountJson = require('./docs/account.json')

const requestBody = consume(accountJson)
  .group('Account') // Returns the Resource Group named Account.
  .resource('/account') // Returns the Resource with a uriTemplate of /account.
  .action('POST') // Returns the Action with a method of POST.
  .example(0) // Returns the first example object.
  .request(0) // Returns the first request object in the example.

expect(requestBody.email).toEqual('user@test.io')
```

