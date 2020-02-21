// Where our custom handlebars helpers will be located.
// See https://handlebarsjs.com/guide/expressions.html#helpers

/**
 * @param {String} toCompare what to check
 * @param {String} value what arg1 is compared to
 */
module.exports.activeLink = (toCompare, value, options) => {
	return toCompare == value ? "active" : "";
};

/**
 * @param value1
 * @param value2
 */
module.exports.isEqual = (value1, value2, options) => {
	if (value1 === value2) {
		return options.fn(this);
	}
	return options.inverse(this);
};
