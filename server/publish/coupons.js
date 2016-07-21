Meteor.publish("yourcoupons", function() {
	if(this.userId){
		return Coupons.find({userId:this.userId}, {});
	}else{
		return Coupons.find({_id:null}, {});
	}
});

Meteor.publish("coupons_empty", function() {
	return Coupons.find({_id:"null"}, {});
});

Meteor.publish("coupons_empty_find_one", function() {
	return Coupons.find({_id:null}, {});
});

