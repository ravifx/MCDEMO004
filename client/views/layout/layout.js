Template.layout.rendered = function() {
	// scroll to anchor
	$('body').on('click', 'a', function(e) { 
		var href = $(this).attr("href");
		if(!href) {
			return;
		}
		if(href.length > 1 && href.charAt(0) == "#") {
			var hash = href.substring(1);
			if(hash) {
				e.preventDefault();
				var offset = $('*[id="' + hash + '"]').offset();
				if (offset) {
					$('html,body').animate({ scrollTop: offset.top - 60 }, 400);
				}
			}
		} else {
			if(href.indexOf("http://") != 0 && href.indexOf("https://") != 0 && href.indexOf("#") != 0) {
				$('html,body').scrollTop(0);
			}
		}
	}); 
	/*TEMPLATE_RENDERED_CODE*/
};

Template.layout.events({ 
    "click": function(event) { // Fix Bootstrap Dropdown Menu Collapse on click outside Menu
        var clickover = $(event.target).closest(".dropdown-toggle").length;
        var opened = $(".navbar-collapse").hasClass("in");
        if (opened === true && !clickover) {
            $('.navbar-collapse').collapse('hide');
        }
    },

    "keyup": function(event) {
        if (event.keyCode === 27) { // Bootstrap Dropdown Menu Collapse on ESC pressed
            var opened = $(".navbar-collapse").hasClass("in");
            if (opened === true) {
                $('.navbar-collapse').collapse('hide');
            }
        }
    }
});


Template.FreeLayoutMainMenu.rendered = function() {
	$(".menu-item-collapse .dropdown-toggle").each(function() {
		if($(this).find("li.active")) {
			$(this).removeClass("collapsed");
		}
		$(this).parent().find(".collapse").each(function() {
			if($(this).find("li.active").length) {
				$(this).addClass("in");
			}
		});
	});
	
	$("body").css({ "position": "relative" });
	$("body").attr({ "data-spy": "scroll", "data-target": "#menu", "data-offset": "70" });
};

Template.FreeLayoutMainMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}
	
});

Template.FreeLayoutMainMenu.helpers({
	
});

Template.UserInfo.helpers({
	"deliveryCount": function() {

		if(this.yourdeliveries){
			var filtered = _.filter(this.yourdeliveries.fetch(), function(obj) {
	    		return obj.status === "DELIVERED";
			});

			return filtered.length;
		} else {
			return 0;
		}
	},
	"nextcoupon": function() {
		
		if(this.yourdeliveries){
			if(this.yourorders.count() == 0){
				return 1;
			}

			var filtered = _.filter(this.yourdeliveries.fetch(), function(obj) {
	    		return obj.status === "DELIVERED";
			});

			return 100 - filtered.length;
		} else {
			return 0;
		}
	}
});


Template.FreeLayout.helpers({
	"isAdmin": function() {
		return Session.get('isAdmin');
	},
	"isNotAdmin": function() {
		return !Session.get('isAdmin');
	},
	"isVendor": function() {
		return Session.get('isVendor');
	},
	"isNotVendor": function() {
		return !Session.get('isVendor');
	}
});

Template.HomeJumbotronJumbotronContent.helpers({
	"isAdmin": function() {
		return Session.get('isAdmin');
	},
	"isNotAdmin": function() {
		return !Session.get('isAdmin');
	}
});

