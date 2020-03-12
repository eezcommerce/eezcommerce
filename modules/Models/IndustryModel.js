var mongoose = require("mongoose");

const IndustryModel = mongoose.model(
	"Industries",
	new mongoose.Schema({
		name: {
			type: String,
			maxlength: 128,
			required: true,
			unique: true
		}
	})
);
IndustryModel.insertMany(
	[
		{
			name: "Oilfield Services/Equipment"
		},
		{
			name: "Life Insurance"
		},
		{
			name: "Shoe Manufacturing"
		},
		{
			name: "Semiconductors"
		},
		{
			name: "Investment Managers"
		},
		{
			name: "Natural Gas Distribution"
		},
		{
			name: "Beverages (Production/Distribution)"
		},
		{
			name: "Hotels/Resorts"
		},
		{
			name: "Major Pharmaceuticals"
		},
		{
			name: "Integrated oil Companies"
		},
		{
			name: "Property-Casualty Insurers"
		},
		{
			name: "Real Estate"
		},
		{
			name: "Savings Institutions"
		},
		{
			name: "Major Chemicals"
		},
		{
			name: "Electrical Products"
		}
	],
	(err, res) => {
		if (err) {
			console.log("Industries already setup");
		}    
	}
);

module.exports = IndustryModel;
