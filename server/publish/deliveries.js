Meteor.publish("yourdeliveries", function() {

	if(this.userId){

		const user = Meteor.users.findOne(this.userId);
		if(user && user.services && user.services.google && (user.services.google.email === "ravifx@gmail.com" || user.services.google.email === "azadfx@gmail.com")){
			return Deliveries.find({});
		}else{

			const user = Meteor.users.findOne(this.userId);

			if(user && user.services && user.services.google && user.services.google.email){
				var vendors = Vendors.find({email:user.services.google.email}, {}).fetch();
				if(vendors && vendors[0] && vendors[0].locality){

				console.log("vendorsvendorsvendors2 :"+vendors[0].locality);
				return Deliveries.find({locality:vendors[0].locality});
				} 
			}
		}
		
		return Deliveries.find({_id:null}, {});
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

