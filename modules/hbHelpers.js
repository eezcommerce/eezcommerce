// Where our custom handlebars helpers will be located.
// See https://handlebarsjs.com/guide/expressions.html#helpers

/**
 * @param {String} toCompare what to check
 * @param {String} value what arg1 is compared to
 */
module.exports.activeLink = (toCompare, value, options) => {
	return toCompare == value ? "active" : "";
};
