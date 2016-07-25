Meteor.publish("yourvendors", function() {

	if(this.userId){

		const user = Meteor.users.findOne(this.userId);

		if(user && user.services && user.services.google && (user.services.google.email === "ravifx@gmail.com" || user.services.google.email === "azadfx@gmail.com")){
			return Vendors.find({});
		}
		
		return Vendors.find({_id:null}, {});
	}else{
		return Vendors.find({_id:null}, {});
	}
});

Meteor.publish("vendors_empty", function() {
	return Vendors.find({_id:"null"}, {});
});

Meteor.publish("vendors_empty_find_one", function() {
	return Vendors.find({_id:null}, {});
});

