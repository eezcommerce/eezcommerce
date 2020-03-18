module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = function(item, id) {
		var storedItem = this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = { item: item, qty: 0, price: 0, pricePer: 0 };
		}
		storedItem.qty++;
		//If you want to store extra variable do it here and get a new cookie
		storedItem.id = id;
		storedItem.name = storedItem.item.name;
		storedItem.img = storedItem.item.img;
		storedItem.category = storedItem.item.category;
		storedItem.pricePer = storedItem.item.price;
		storedItem.price = storedItem.item.price * storedItem.qty;

		this.totalQty++;
		this.totalPrice += item.price;
	};

	this.remove = function(item, id) {
		var storedItem = this.items[id];
		if (storedItem) {
			this.totalQty -= storedItem.qty;
			this.totalPrice -= storedItem.item.price * storedItem.qty;
			delete this.items[id];
		}
	};

	this.clear = function() {
		if (this.items) {
			this.totalQty = 0;
			this.totalPrice = 0;
			delete this.items;
		}
	};

	this.generateArray = function() {
		var arr = [];
		for (var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};
};
