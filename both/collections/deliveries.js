this.Deliveries = new Mongo.Collection("deliveries");

this.Deliveries.userCanInsert = function(userId, doc) {
	return true;
};

this.Deliveries.userCanUpdate = function(userId, doc) {
	return true;
};

this.Deliveries.userCanRemove = function(userId, doc) {
	return true;
};