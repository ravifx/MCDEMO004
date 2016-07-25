this.Vendors = new Mongo.Collection("vendors");

this.Vendors.userCanInsert = function(userId, doc) {
	return true;
};

this.Vendors.userCanUpdate = function(userId, doc) {
	return true;
};

this.Vendors.userCanRemove = function(userId, doc) {
	return true;
};