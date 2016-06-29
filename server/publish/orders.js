Meteor.publish("yourorders", function() {
	if(this.userId){
		return Orders.find({createdBy:this.userId}, {});
	}else{
		return Orders.find({_id:null}, {});
	}
});

Meteor.publish("orders_empty", function() {
	return Orders.find({_id:"null"}, {});
});

Meteor.publish("orders_empty_find_one", function() {
	return Orders.find({_id:null}, {});
});

