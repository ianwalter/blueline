# @ianwalter/blueline
> Toolkit for converting API Blueprint files to JSON and consuming that JSON

[![npm page][npmImage]][npmUrl]

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
import { Blueprint } from '@ianwalter/blueline'

import json from './docs/account.json'

// Verbose usage:
const createAccountRequest = new Blueprint(json)
  .group('Account') // Returns the Resource Group named Account.
  .resource('/account') // Returns the Resource with a uriTemplate of /account.
  .action('POST') // Returns the Action with a method of POST.
  .example(0) // Returns the first example object.
  .request(0) // Returns the first request object in the example.
  .body() // Returns the JSON-parsed request body.

// Simplified usage:
// Get an example request with a unique name:
const { body } = new Blueprint(json).request('Update Account').json
```

## Related

* [`@ianwalter/drakov`][drakovUrl] -  Mock server that implements the API
Blueprint specification

## License

Apache 2.0 with Commons Clause - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://iankwalter.com)

[npmImage]: https://img.shields.io/npm/v/@ianwalter/blueline.svg
[npmUrl]: https://www.npmjs.com/package/@ianwalter/blueline
[drakovUrl]: https://github.com/ianwalter/drakov
[licenseUrl]: https://github.com/ianwalter/blueline/blob/master/LICENSE
