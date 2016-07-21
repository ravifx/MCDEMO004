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
  },
  'orders.count'(userId) {
  	return Orders.find({createdBy:userId}, {}).count();;
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

	var userdetails = Userdetails.findOne({"userId":userId}, {});

	var fromdate = doc.fromdate;
	var today = new Date();

	if(fromdate.getFullYear() == today.getFullYear() && fromdate.getMonth() == today.getMonth() && fromdate.getDate() == today.getDate()){
		
		var deliverydata = {};
		
		deliverydata["userId"] = doc.createdBy;
		deliverydata["mobileNo"] = doc.mobileNo;
		deliverydata["city"] = doc.city;
		deliverydata["watertype"] = doc.watertype;
		deliverydata["quantity"] = doc.quantity;
		deliverydata["locality"] = doc.locality;
		deliverydata["address"] = doc.address;
		deliverydata["fromdate"] = doc.fromdate;
		deliverydata["todate"] = doc.todate;
		deliverydata["deliverytype"] = doc.deliverytype;
		deliverydata["deliverytime"] = doc.deliverytime;
		deliverydata["createdAt"] = new Date();
		deliverydata["status"] = "DRAFT";
		deliverydata["orderid"] = doc._id;

		deliverydata = deepen(deliverydata);

		Deliveries.insert(deliverydata);
	}

	if(userdetails != null && userdetails != undefined){

		Userdetails.update(
		   { "_id": userdetails._id }, {
		   	$set:{
		      mobileNo: doc.mobileNo,
		      city: doc.city,
		      watertype: doc.watertype,
		      quantity: doc.quantity,
		      locality: doc.locality,
		      address: doc.address,
		      deliverytype: doc.deliverytype,
		      deliverytime: doc.deliverytime,
		   }
		},
		   { upsert: true }
		)
	} else {
		var userdata = {};
		userdata["userId"] = userId;
		userdata["mobileNo"] = doc.mobileNo;
		userdata["city"] = doc.city;
		userdata["watertype"] = doc.watertype;
		userdata["quantity"] = doc.quantity;
		userdata["locality"] = doc.locality;
		userdata["address"] = doc.address;
		userdata["deliverytype"] = doc.deliverytype;
		userdata["deliverytime"] = doc.deliverytime;
		userdata["createdAt"] = new Date();
		userdata = deepen(userdata);
		Userdetails.insert(userdata);	
	}

	var count = Orders.find({createdBy:userId}, {}).count();

	if(count != undefined && count == 1){

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
		coupon["expiryDate"] = expiryDate;

		coupon = deepen(coupon);
		Coupons.insert(coupon);
	}

});

Orders.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Orders.after.remove(function(userId, doc) {
	
});
