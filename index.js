/**
 * @param {object} object is the object containing the possible arguments
 *   to execute, as well as the values to return if they are given.
 * @example {
 *   //if this one-letter param is found, return true.
 *   "-b": true,
 * 
 *   //if either is found, return true.
 *   "--thisoption|--thisother": true,
 * 
 *   //if either is found, return its equivalent index,
 *   //otherwise the one after the last is returned
 *   //ex: given 3 params, if none is found, return the forth of the array
 *   "--thisop|--thatop|--thirdop": ["A","B","C","??"],
 * 
 *   //user-given parameters should be represented by '*'.
 *   //if a string is provided, the user's argument is appended,
 *   //otherwise replaced.
 *   "--file=*|-f *": ""
 * }
 * @param {array} givenParams is the array containing the parameters to be
 *   compared aganist. Default is `process.argv`.
 * @returns {object} The given variables to the given arguments.
 *   The keys are identified by the first parameter.
 */
const parseArguments = (object, givenParams = process.argv) => {
	if(typeof object !== "object") throw new TypeError("Coudn't parse arguments. Given parser argument should be an object.")
	var active = {}
	for(var key in object) { //for each given key/param... 
		const args = key.split("|") //split the string into different keys with '|'
		args.every((key,index) => { //gathers the acquired keys...
			if(key.startsWith('--'))
				if(key.endsWith('=*')) active[key] = givenParams[index]
				else {}
			else if(key.startsWith('-')) //if it starts with one minus (e.g "-b")...
				if(key.length>2 && !key.endsWith(' *')) throw new Error('"-" parameters cannot contain more than one letter.')
				else if(key.endsWith(" *")) active[key] = givenParams[index]
		})
	}
	return active
}
parseArguments({
	hi: "oi",
	1: "hello",
	2: "olá",
	4: "EEEEEEEEEEEEE"
})

module.exports = parseArguments
