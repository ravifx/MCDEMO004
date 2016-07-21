Deliveries.allow({
	insert: function (userId, doc) {
		return Deliveries.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Deliveries.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Deliveries.userCanRemove(userId, doc);
	}
});

Meteor.methods({

  'deliveries.confirmdelivery'(id) {
  	Deliveries.update({
			_id: id
		}, {
			$set:{
				status: "DELIVERED" 
			}
		});
  }

});

Deliveries.before.insert(function(userId, doc) {

});

Deliveries.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

Deliveries.before.remove(function(userId, doc) {
	
});

Deliveries.after.insert(function(userId, doc) {

});

Deliveries.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Deliveries.after.remove(function(userId, doc) {
	
});
