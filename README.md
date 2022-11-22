# How to use this validator package

Install the package:

```bash
npm i -s @michielmulders/hip412-validator
```

Import the package into your project. You can import the `validator` function and the default schema version for HIP412 with `defaultVersion`.

```js
const { validator, defaultVersion } = require('@michielmulders/hip412-validator');
```

You can use the `validator` like below. 
1. The first parameter is the stringified JSON object you want to verify against a JSON schema
2. The second parameter is the version of HIP412 metadata schema against which you want to validate your metadata instance. The default value is `1.0.0`. In the future, new HIP412 schema versions might be added depending on community needs.

```js
const metadata = {
    attributes: [
        { trait_type: "Background", value: "Yellow" }
    ],
    creator: "NFT artist",
};
const version = '1.0.0';

const errors = validator(JSON.stringify(metadata), version);
```

## Errors format

The interface for errors looks like this:

```json
{
    "type": "Indicates which validator created the error. Possible values: schema, attribute, localization, and SHA256.",
    "msg": "Indicates the specific error explanation to be displayed to the user"
}
```

Here's an example:

```json
{
    "type": "attribute",
    "msg": "Trait stamina of type 'percentage' must be between [0-100], found 157"
}
```

## Who is this for

Anyone who wants to build NFT tooling on Hedera Hashgraph and needs to verify NFT metadata for validatiy against the [HIP412 metadata standard](https://github.com/hashgraph/hedera-improvement-proposal/blob/main/HIP/hip-412.md).

## Questions or Improvement Proposals?

Please create an issue or PR on [this repository](https://github.com/michielmulders/hip412-validator). Make sure to join the [Hedera Discord server](https://hedera.com/discord) to ask questions or discuss improvement suggestions.
