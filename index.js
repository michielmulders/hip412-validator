const { schemaValidator, attributesValidator, localizationValidator, SHA256Validator } = require("./validators");
const { getSchema, defaultVersion } = require("./schemas");

/**
 * Distil an errors array from JSON schema into errors and warnings. 
 * We want to separate "additional property" errors into warnings because they don't influence the further validatin of the JSON object.
 * 
 * @param {Array} problems - Errors array from jsonschema
 */
const distilProblems = (problems) => {
    const warnings = problems.find(problem => {
        if (problem.msg.includes(additionalPropertyMsg)) return problem;
        return null;
    })
    const filteredWarnings = warnings.filter(warning => !!warning)
    console.log(filteredWarnings);
    const errors = problems.find(problem => {
        if (!problem.msg.includes(additionalPropertyMsg)) return problem;
        return null;
    })
    const filteredErrors = errors.filter(error => !!error)
    console.log(filteredErrors);

    return {
        warnings: filteredWarnings,
        errors: filteredErrors
    }
}

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
    let warnings = [];

    const schema = getSchema(schemaVersion)

    // When errors against the schema are found, you don't want to continue verifying the NFT
    const schemaProblems = schemaValidator(instance, schema);
    if (schemaProblems.length > 0) {
        // However we don't want to continue if it only contains "additional property" errors because they don't hinder the further verification of the NFT
        const additionalPropertyMsg = "is not allowed to have the additional property";
        const additionalPropertyCheck = schemaProblems.map(problem => problem.msg.includes(additionalPropertyMsg))

        // If it contains at least one other type of error, we want to return the schema errors instead of continuing the verification process
        if (!additionalPropertyCheck.every(propertyCheck => propertyCheck === true)) {
            return distilProblems(schemaProblems);
        }

        const distilledProblems = distilProblems(schemaProblems);
        errors.push(...distilledProblems.errors);
        warnings.push(...distilledProblems.warnings);
    }

    const attributeErrors = attributesValidator(instance);
    errors.push(...attributeErrors);

    const localizationErrors = localizationValidator(instance);
    errors.push(...localizationErrors);

    const SHA256Errors = SHA256Validator(instance);
    errors.push(...SHA256Errors);

    return {
        errors,
        warnings
    };
}

module.exports = {
    validator,
    defaultVersion
};
