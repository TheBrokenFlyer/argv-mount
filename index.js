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
 *   "--file=*|-f *": "",
 * 
 *   //if the given parameter does not start with a dash,
 *   //the return value should be an object. in which case,
 *   //this function is executed recursively.
 *   "do": {
 *     "this": true,
 *     "that": 1,
 *   }
 * }`
 * @param {string[]} givenParams is the array containing the parameters to be
 *   compared aganist. Default is `process.argv`.
 * @returns {object} The given variables to the given arguments.
 *   The keys are identified by the first parameter.
 */
const parseArguments = (object, givenParams = [...process.argv.slice(2)]) => {
	if(typeof object !== "object") throw new TypeError("Error while parsing arguments. Given parser argument should be an object.")
	/** The returning variables to sending */
	var active = {}
	for(var key in object) { //for each given key:param...
		if(key.search("||")) throw new SyntaxError('Found "||". single pipe ("|") should be used instead.')

		/** the different keys split with '|' to form the strings */
		const args = key.split("|")
		
		//gathers the acquired keys...
		args.every((key,index) => {
			active[key] =
				//if argument is found...
				givenParams.includes(key.slice(0,key.length-3))?
					//if key ends with "=*"...
					key.endsWith("=*")?
						//(=*) splits the key, gathers the content after "=".
						givenParams[givenParams.indexOf(key.slice(0,key.length-3))].split('=',2)[1]:false
					//else if ends with " *"...
					|| key.endsWith(" *")?
						//(*) gathers the content after the parameter.
						givenParams[givenParams.indexOf(key.slice(0,key.length-3))]:false
					||//otherwise...
					object[key] //just the value of the object key.
				//if argument is not found, null.
				:null;

			//if active is null and 'null' in the object represents the active argument, continue the loop.
			if(active[key] === null && object[key] === null) return true
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
