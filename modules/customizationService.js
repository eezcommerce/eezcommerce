const CustomizationModel = require("./Models/CustomizationModel");
const sass = require("sass");
const fs = require("fs");
/**
 * @param {String} id the user id for the website to initialize
 */
module.exports.initialize = id => {
	return new Promise((resolve, reject) => {
		let cust = new CustomizationModel({
			owner: id,
			primaryColor: "#0022ff",
			secondaryColor: "#efeff"
		});

		cust.save((err, obj) => {
			if (err) {
				reject(err);
			} else {
				resolve(obj);
			}
		});
	});
};

/**
 * @param {String} id the user id for the website to update
 * @param {Object} customization customization object to update
 */
module.exports.edit = (id, customization) => {
	return new Promise((resolve, reject) => {
		CustomizationModel.updateOne({ owner: id }, customization, (err, resp) => {
			if (err) {
				reject(err);
			} else {
				let customSass = sass.renderSync({
					data: `
						@import "node_modules/bootstrap/scss/_functions";
						
						
						$theme-colors: (
							"primary": #${customization.primaryColor},
							"secondary": #${customization.secondaryColor}
						);
		
						.hover:hover {
							opacity: 0.5;
							transition: 0.5s ease;
							box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
						}
		
						@import "node_modules/bootstrap/scss/bootstrap";
		
						.bg-secondary{
							color: color-yiq(#${customization.secondaryColor}, #111111, #ffffff);
						}
		
						.bg-primary{
							color: color-yiq(#${customization.primaryColor}, #111111, #ffffff);
						}
		
					`
				});

				try {
					fs.writeFileSync(__dirname + "/../public/siteData/" + id + "/theme.css", customSass.css);
					resolve();
				} catch (err) {
					reject(err);
				}
			}
		});
	});
};

/**
 * @param {String} id the user id for the website to update
 */
module.exports.get = id => {
	return new Promise((resolve, reject) => {
		CustomizationModel.findOne({ owner: id }, {}, { lean: true }, (err, resp) => {
			if (err) {
				reject(err);
			} else {
				resolve(resp);
			}
		});
	});
};
