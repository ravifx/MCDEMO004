Coupons.allow({
	insert: function (userId, doc) {
		return Coupons.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Coupons.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Coupons.userCanRemove(userId, doc);
	}
});

Meteor.methods({
  'coupons.insertvalues'(values) {

  	Coupons.insert(values);
  }
});

Coupons.before.insert(function(userId, doc) {

});

Coupons.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

Coupons.before.remove(function(userId, doc) {
	
});

Coupons.after.insert(function(userId, doc) {

});

Coupons.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Coupons.after.remove(function(userId, doc) {
	
});
