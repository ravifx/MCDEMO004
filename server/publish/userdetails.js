Meteor.publish("yourdetails", function() {
	
	if(this.userId){
		return Userdetails.find({userId:this.userId}, {});
	}else{
		return Userdetails.find({_id:null}, {});
	}
});

Meteor.publish("yourdetails_empty", function() {
	return Userdetails.find({_id:"null"}, {});
});

Meteor.publish("yourdetails_empty_find_one", function() {
	return Userdetails.find({_id:null}, {});
});

