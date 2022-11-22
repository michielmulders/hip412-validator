const { schemaValidator, attributesValidator, localizationValidator, SHA256Validator } = require("./validators");
const { getSchema, defaultVersion } = require("./schemas");

/**
 * Validate a metadata object against a schema. This function validates the instance respectively against
 * the schema validator, attributes validator, localization validator, and SHA256 validator. 
 * 
 * If the schema validator (jsonschema) returns errors, it's not possible to run the other validators because properties might be missing.
 * The other validators are executed when the schema validator only returns "additional property" erros which don't affect the execution of other validators.
 * 
 * @param {Object} instance - The JSON object to validate against a schema
 * @param {string} schemaVersion [schemaVersion = defaultVersion = 1.0.0] - The metadata schema version against which we want to validate our {instance}
 * @returns {Array} - Contains no, one, or multiple error objects that describe errors for the validated {instance}
 */
const validator = (instance, schemaVersion = defaultVersion) => {
    let errors = [];

    const schema = getSchema(schemaVersion)

    // When errors against the schema are found, you don't want to continue verifying the NFT
    const schemaErrors = schemaValidator(instance, schema);
    if (schemaErrors.length > 0) {
        // However we don't want to continue if it only contains "additional property" errors because they don't hinder the further verification of the NFT
        const additionalPropertyMsg = "is not allowed to have the additional property";
        const additionalPropertyCheck = schemaErrors.map(error => error.msg.includes(additionalPropertyMsg))

        // If it contains at least one other type of error, we want to return the schema errors instead of continuing the verification process
        if (!additionalPropertyCheck.every(propertyCheck => propertyCheck === true)) {
            return schemaErrors;
        }

        errors.push(...schemaErrors);
    }

    const attributeErrors = attributesValidator(instance);
    errors.push(...attributeErrors);

    const localizationErrors = localizationValidator(instance);
    errors.push(...localizationErrors);

    const SHA256Errors = SHA256Validator(instance);
    errors.push(...SHA256Errors);

    return errors;
}

module.exports = {
    validator,
    defaultVersion
};
