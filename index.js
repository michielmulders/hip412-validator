const { schemaValidator, attributesValidator, localizationValidator, SHA256Validator } = require("./validators");
const { getSchema, defaultVersion } = require("./schemas");

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
    validator
};
