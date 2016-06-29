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

	if(this.yourorders && this.yourorders.count() == 1){
		var coupon = {};
		var greenTrendsPrefix = "TICKG";
		var couponCode = Math.floor(1000 + Math.random() * 9000);
		coupon["vendorCode"] = "GTHSS";
		coupon["couponCode"] = greenTrendsPrefix + couponCode;
		coupon["description"] = "Discount of 20% on bill of Rs 500 or more";
		coupon["userId"] = userId;
		coupon["orderId"] = doc._id;
		coupon["createdAt"] = new Date();

		var expiryDate = new Date();
	    expiryDate.setMonth(expiryDate.getMonth() + 1);
		console.log(expiryDate);
		coupon["expiryDate"] = expiryDate;

		coupon = deepen(coupon);
		Coupons.insert(coupon);
	}
});

Orders.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Orders.after.remove(function(userId, doc) {
	
});
