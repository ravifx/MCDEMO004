Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var freeRoutes = [
	"Home"
];

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		$("body").addClass("wait");
		this.render("loading");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.map(function () {
	this.route("home", {
		path: "/", 
		template:function () {

			var isVendor = Session.get('isVendor');
			var isAdmin = Session.get('isAdmin');

			if(isVendor){
				return "Vendor";
			}else if(isAdmin){
				return "Admin";
			}else{
				return "Home";
			}
		}
	});
	this.route("home2", {
		path: "/home", 	
		template:'Home'
	});
	this.route("logout", {
		path: "/logout", 	
		template:'Home'
	});

	this.route('dashboard', function () {
		this.render("HomeYourorders");
		this.render("HomeYourCoupons");
		this.render("HomeOrdernowInsertForm");
		this.render("UserInfo");
		if(Session.get('isVendor')){
			this.redirect('/vendor');
		}else if(Session.get('isAdmin')){
			this.redirect('/admin');
		}else{
			this.redirect('/');
		}
	});

	this.route("/admin", function(){
	    this.redirect('/');
	});

	this.route("/vendor", function(){
	  	this.redirect('/');
	});

});
