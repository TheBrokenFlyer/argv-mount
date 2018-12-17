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
 * @description gathers a string and returns its validation
 * @param {string} match is the string to be checked 
 * @param {number} index (for iteration) the index of the current array iteration
 * @param {Array} array (for iteration) 
 * @returns {boolean} a boolean determining weither or not this argument
 *   asks for another parameter
 */
function checkSyntax(match,index,array) {
	if (typeof match!=="string") throw new TypeError("Invalid type for Match validation at the given string! \""+match+"\"")
	var type
	if(//if(none of the sintaxes match)...
		(type =
			//letters, numbers and dashes, should start with 2 dashes ("--"),
			//  should not end with a dash.
			match.match(/^--[a-zA-Z0-9-]{1,}[a-zA-Z0-9]$/)?false:null
			//same as before, but including next param
			|| match.match(/^--[a-zA-Z0-9-]{1,}[a-zA-Z0-9]=<>$/)?true:null
			//one dash and one (lower|upper)case letter.
			|| match.match(/^-[a-zA-Z]{1}$/)?false:null
			//same as before, but including next param
			|| match.match(/^-[a-zA-Z]{1} <>$/)?true:null
		)===null) throw new SyntaxError("Given parameter syntax is not valid!")
	else return type
}

/**
 * Class for managing matches to the arguments list. This is actually
 * just an assistance for auto-completing and stuff. It represents
 * a possible argument that the user can give when executing your
 * script via terminal.
 */
class Match {
	/**
	 * @description Creates a parameter and checks its validation
	 * @constructor aasdas
	 * @param {string|string[]} matches the possible argument(s) that 
	 *   the user can give for this return.
	 * @param {*} returns the returning value if the argument is found.
	 * @param {string} name is the label for the key when returning 
	 *   the parsed arguments.
	 * @param {boolean} [isRecursive=undefined] determines weither or not
	 *   this match should be recursive. If the value is `true`, `parseArguments`
	 *   should be executed recursively on this instance, and its returning
	 *   value will be actually the results of `parseArguments((returns),givenParams[index...end])`.
	 *   If the value is `false`, the `returns` will stay the same after parsing,
	 *   regardless of its type. `undefined` should be interpreted as `true`
	 */
	constructor(matches,returns,name,isRecursive) {
		if(typeof matches==="undefined") throw new TypeError("Missing match pattern.")
		if(typeof returns==="undefined") throw new TypeError("Missing return value.")
		if(typeof name==="undefined") throw new TypeError("Missing name.")
		if(matches instanceof Array) {
			this.isArgument = matches.every(checkSyntax)
			if(matches.some(checkSyntax)!==this.isArgument)
				throw SyntaxError("Either every or none of the parameters should ask for an aditional parameter.")
		}
		else this.isArgument = checkSyntax(matches)
		this.matches = matches
		this.returns = returns
		this.name = name
		this.isRecursive = isRecursive
		if(!isRecursive&&!(returns instanceof Array || returns.every(val => val instanceof Match)
	}
}

/**
 * @description With the given keys in an object and its return values, 
 *   this function gathers each given key or set of keys and compares
 *   aganist the given node parameters by the user to parse the set
 *   equivalent values to return to the program.
 * @param {Match|Match[]|Array.<{matches:(string|string[]),returns:any,name:string}>} args
 *   is the set of arguments to be looked for.
 * @param {string[]} givenParams is the string array containing the arguments
 *   to be compared aganist.
 * @note if an entry in the `args` array has an array as its `returns` value
 *   and its `matches` value, the returning value will be the index of the first
 *   parameter that was found.
 * @returns {{key0,key1,key2,'...'}} the results of all parsed parameters
 */
const parseArguments = (args, givenParams = [...process.argv.slice(2)]) => {
	/** the results of all parsed parameters */
	var results = {}
	if(args instanceof Array) {
		args.forEach((match,index) => {},results)
	} else results[args.name] = args.returns
}
parseArguments()

module.exports = {
	parse:parseArguments,
	Match
}
