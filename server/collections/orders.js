Orders.allow({
	insert: function (userId, doc) {
		return Orders.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Orders.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Orders.userCanRemove(userId, doc);
	}
});

/*import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';*/
 
Meteor.methods({
  'orders.insertvalues'(values) {

  	Orders.insert(values);
  },

  'orders.cancelorder'(id) {
  	Orders.update({
			_id: id
		}, {
			$set:{
				status: "CANCELLED" 
			}
		});
  }

});

Orders.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = new Date();
	doc.modifiedBy = userId;
	doc.status = "ACTIVE";

	if(!doc.createdBy) doc.createdBy = userId;
});

Orders.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

Orders.before.remove(function(userId, doc) {
	
});

Orders.after.insert(function(userId, doc) {

});

Orders.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Orders.after.remove(function(userId, doc) {
	
});
