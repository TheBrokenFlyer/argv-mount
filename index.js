/**
 * 
 * @param {object} object is the object containing the available options
 *   as keys and resulting variables as values.
 * @returns {object} The given variables from the arguments in the object
 */
const parseArguments = (object) => {
	if(typeof object !== "object") throw new TypeError("Coudn't parse arguments. Given parser argument should be an object.")
}

module.exports = parseArguments
