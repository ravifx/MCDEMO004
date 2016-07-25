Vendors.allow({
	insert: function (userId, doc) {
		return Vendors.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Vendors.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Vendors.userCanRemove(userId, doc);
	}
});

Meteor.methods({

  'vendors.insert'(values) {
  	Vendors.insert(values);

  },
  'vendors.cancel'(id) {
  	Vendors.update({
			_id: id
		}, {
			$set:{
				status: "CANCELLED" 
			}
		});
  },
  'vendors.isVendor'() {

  	if(this.userId){

	  	const user = Meteor.users.findOne(this.userId);

		if(user && user.services && user.services.google && user.services.google.email){

			var vendors = Vendors.find({email:user.services.google.email}, {}).fetch();
			
			if(vendors && vendors.length > 0){
				return true;
			} else {
				return false;
			}
		}
	  	
	  	}
	 }
});

Vendors.before.insert(function(userId, doc) {

	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = new Date();
	doc.modifiedBy = userId;
	doc.status = "ACTIVE";

	if(!doc.createdBy) doc.createdBy = userId;

});

Vendors.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

Vendors.before.remove(function(userId, doc) {
	
});

Vendors.after.insert(function(userId, doc) {

});

Vendors.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Vendors.after.remove(function(userId, doc) {
	
});
