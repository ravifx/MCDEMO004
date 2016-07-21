this.AdminController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	/*onBeforeAction: function() {
		this.next();
	},*/

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("orders_empty"),
			Meteor.subscribe("yourorders"),
			Meteor.subscribe("yourcoupons"),
			Meteor.subscribe("yourdetails"),
			Meteor.subscribe("yourdeliveries")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {

		var data = {
			params: this.params || {},
			orders_empty: Orders.find({_id:null}, {}),
			yourorders: Orders.find({}, {}),
			yourcoupons: Coupons.find({}, {}),
			yourdetails: Userdetails.find({}, {}),
			yourdeliveries: Deliveries.find({}, {})
		};

		return data;
	},

	onAfterAction: function() {
		
	}
});