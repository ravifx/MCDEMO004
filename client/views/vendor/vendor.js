
Template.Vendor.rendered = function() {
	
};

Template.VendorJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("", {});
	}
	
});

