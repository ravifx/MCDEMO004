this.Orders = new Mongo.Collection("orders");

this.Orders.userCanInsert = function(userId, doc) {
	return true;
};

this.Orders.userCanUpdate = function(userId, doc) {
	return true;
};

this.Orders.userCanRemove = function(userId, doc) {
	return true;
};

this.Coupons = new Mongo.Collection("coupons");

this.Coupons.userCanInsert = function(userId, doc) {
	return true;
};

this.Coupons.userCanUpdate = function(userId, doc) {
	return true;
};

this.Coupons.userCanRemove = function(userId, doc) {
	return true;
};