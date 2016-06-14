Meteor.publish("yourorders", function() {
	return Orders.find({}, {});
});

Meteor.publish("orders_empty", function() {
	return Orders.find({_id:"null"}, {});
});

Meteor.publish("orders_empty_find_one", function() {
	return Orders.find({_id:null}, {});
});

