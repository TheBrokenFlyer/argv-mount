/**
 * @description Just an Error class to handle parameters that are 
 *   not found without much conflict.
 */
class ParamNotFound extends Error {
	/**
	 * @param {string[]} args `string,string,string` the regular 
	 *   parameters you would give to an error, that being "name",
	 *   "message" and "stack"
	 */
	constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, ParamNotFound)
    }
}

/**
 * @description With the given keys in an object and its return values, 
 *   this function gathers each given key or set of keys and compares
 *   aganist the given node parameters by the user to parse the set
 *   equivalent values to return to the program.
 * @param {object} object is the object containing the possible arguments
 *   to execute, as well as the values to return if they are given.
 * @example
 * {
 *   //if this one-letter param is found, return true.
 *   "-b": true,
 * 
 *   //if either is found, return true.
 *   "--thisoption|--thisother": true,
 * 
 *   //if either is found, return its equivalent index.
 *   //ex: if "--thisop" is found, return "A" and ignore the rest.
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
 * }
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
	///validating
		if(key.includes("||")) throw new SyntaxError('Found "||". single pipe ("|") should be used instead.')
		else if (key.startsWith("|")||key.endsWith("|")) throw new SyntaxError('A key cannot start or end with a pipe ("|"). Use the pipe to divide the arguments related to the same output.')

		/** the different keys split with '|' to form the strings */
		const args = key.split("|")
		
		//gathers the acquired keys...
		args.some((key,index) => {
			active[key] =
				//if argument is found...
				givenParams.some(val => val.includes(key.split(/=/,1)[0]))?
					object[args] instanceof Array?
						object[args][index]
						:false
					|| //if (endsWith "=*") {...
					key.endsWith("=*")?
						!key.startsWith('--')? //if it's not a "--*" key
							new SyntaxError('Error parsing! Parameter ending with "=*" should start with two dashes ("--")'):
							//(=*) gathers 'key=arg' at position, splits key with "=", gathers the second slice.
							givenParams[givenParams.indexOf(key.slice(0,key.length-3))].split('=',2)[1]:false

					|| //} else if (endsWith " *"){...
					key.endsWith(" *")?
						key.startsWith("--")? //if it's not a "-@" key
							new SyntaxError('Error parsing! Parameter ending with " *" should start with one dash and contain only one letter ("-@")'):
							//(*) gathers 'arg' after 'key'
							givenParams[givenParams.indexOf(key.slice(0,key.length-3))]:false
					|| //} else if () {
					object[args] //just the value of the object key.
				//if argument is not called on the program...
				:new ParamNotFound();

			//if active is null and 'null' in the object represents the active argument, continue the loop.
			if(active[key] instanceof SyntaxError) throw active[key]
			else if (active[key] instanceof ParamNotFound) return false
			else if (active[key] instanceof Object)
				active[key] = parseArguments(active[key],givenParams)
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
