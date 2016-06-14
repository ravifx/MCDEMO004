Meteor.publish("yourorders", function() {
	console.log("XXXXXX"+this.userId);
	if (!this.userId) {
        this.ready();
        return;
    }

	return Orders.find({createdBy:this.userId}, {});
});

Meteor.publish("orders_empty", function() {
	return Orders.find({_id:"null"}, {});
});

Meteor.publish("orders_empty_find_one", function() {
	return Orders.find({_id:null}, {});
});

