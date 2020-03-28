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
			primaryColor: "007bff",
			secondaryColor: "6c757d",
			darkColor: "343a40",
			lightColor: "f8f9fa"
		});

		cust.save((err, obj) => {
			if (err) {
				reject(err);
			} else {
				this.edit(obj.owner, obj);
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
		CustomizationModel.findOneAndUpdate({ owner: id }, customization, (err, resp) => {
			if (err) {
				reject(err);
			} else {
				try {
					let customSass = sass.renderSync({
						data: `
							@import "node_modules/bootstrap/scss/_functions";

							$primary: #${customization.primaryColor};
							$secondary: #${customization.secondaryColor};
							$light: #${customization.lightColor};
							$dark: #${customization.darkColor};
							
							@import "themes/${customization.themeId}.scss";

							
			
							@import "node_modules/bootstrap/scss/bootstrap";
			
							
	
							.bg-secondary{
								color: color-yiq(#${customization.secondaryColor}, #222222, #ffffff);
							}
			
							.bg-primary{
								color: color-yiq(#${customization.primaryColor}, #222222, #ffffff);
							}
	
			
						`
					});
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
