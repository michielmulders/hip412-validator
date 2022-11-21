const HIP412_1_0_0 = require("./HIP412@1.0.0.json");

const schemaMap = new Map();
schemaMap.set('1.0.0', HIP412_1_0_0);

const defaultVersion = '1.0.0'; // Default is HIP412@1.0.0

/*
 * @param version (string)
 * @desc expects a version string that matches a string in the schemaMap like "1.0.0" to load a specific version of the HIP412 metadata JSON schema
*/
const getSchema = (version) => {
    const validVersion = schemaMap.has(version);
    if (validVersion) {
        return schemaMap.get(version);
    }
    
    return schemaMap.get(defaultVersion);
}

module.exports = {
    getSchema,
    defaultVersion
}