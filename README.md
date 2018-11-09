# @ianwalter/blueline
> Toolkit for converting API Blueprint files to JSON and consuming that JSON

## Installation

```console
npm install @ianwalter/blueline --save-dev
```

## Usage

Example of generating API Blueprint JSON files using the CLI:

```console
npx blueline src/docs docs

  👍 Generated API Blueprint JSON!

```

Example of consuming an API Blueprint JSON file and asserting that one of the
request properties has a certain value:

```js
const Blueprint = require('@ianwalter/blueline')

const json = require('./docs/account.json')

const createAccountRequest = new Blueprint(json)
  .group('Account') // Returns the Resource Group named Account.
  .resource('/account') // Returns the Resource with a uriTemplate of /account.
  .action('POST') // Returns the Action with a method of POST.
  .example(0) // Returns the first example object.
  .request(0) // Returns the first request object in the example.
  .body() // Returns the JSON-parsed request body.

// Get an example request with a unique name:
const updateAccountRequest = new Blueprint(json).request('Update Account').body()

expect(creatAccountRequest.email).toEqual('user@test.io')
```

## License

Apache 2.0 with Commons Clause - See [LICENSE](https://github.com/ianwalter/blueline/blob/master/LICENSE)

&nbsp;

Created by [Ian Walter](https://iankwalter.com)

