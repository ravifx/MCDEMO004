Meteor.publish("yourdeliveries", function() {

	if(this.userId){

		const user = Meteor.users.findOne(this.userId);
		if(user && user.services && user.services.google && (user.services.google.email === "ravifx@gmail.com" || user.services.google.email === "azadfx@gmail.com")){
			return Deliveries.find({});
		}
		
		return Deliveries.find({userId:this.userId}, {});
	}else{
		return Deliveries.find({_id:null}, {});
	}
});

Meteor.publish("deliveries_empty", function() {
	return Deliveries.find({_id:"null"}, {});
});

Meteor.publish("deliveries_empty_find_one", function() {
	return Deliveries.find({_id:null}, {});
});

