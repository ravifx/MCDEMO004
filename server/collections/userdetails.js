Userdetails.allow({
	insert: function (userId, doc) {
		return Userdetails.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Userdetails.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Userdetails.userCanRemove(userId, doc);
	}
});

Meteor.methods({
  'userdetails.insertvalues'(values) {

  	Userdetails.insert(values);
  }
});

Userdetails.before.insert(function(userId, doc) {

});

Userdetails.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

Userdetails.before.remove(function(userId, doc) {
	
});

Userdetails.after.insert(function(userId, doc) {

});

Userdetails.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Userdetails.after.remove(function(userId, doc) {
	
});
