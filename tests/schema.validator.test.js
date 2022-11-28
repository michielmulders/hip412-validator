const { schemaValidator } = require('../validators/schema');
const { getSchema, defaultVersion } = require('../schemas');
const validMetadata = require('./data/valid-HIP412.json');

let attributes = [
    { checksum: "randomchecksum", trait_type: "Background", value: "Yellow" },
    { checksum: "randomchecksum", trait_type: "Fur", value: "Gold" }
]

let additionalProperty = "additional property outside properties object";

describe("Schema validator tests", () => {
  test("it should return an error when adding additional attributes", () => {
    // Arrange
    const schema = getSchema(defaultVersion);

    let metadata = JSON.parse(JSON.stringify(validMetadata));
    metadata.attributes = attributes;

    // Act
    const errors = schemaValidator(metadata, schema);

    // Assert
    expect(Array.isArray(errors)).toBe(true);
    expect(errors.length).toBe(2);
    // test for "path" property
  });
});
