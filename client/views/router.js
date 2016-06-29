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
		template:'Home'
	});
	this.route("home2", {
		path: "/home", 	
		template:'Home'
	});
	this.route("logout", {
		path: "/logout", 	
		template:'Home'
	});
	/*this.route('dashboard', {
		path:'/dashboard',
		template:'Home'
	});*/
	this.route('dashboard', function () {
		this.render("HomeYourorders");
		this.render("HomeYourCoupons");
		this.redirect('/');
	});
});
