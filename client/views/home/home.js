var pageSession = new ReactiveDict();

Template.Home.rendered = function() {
	
};

Template.Home.events({
	
});

Template.Home.helpers({
	
});

Template.HomeJumbotron.rendered = function() {
	
};

Template.HomeJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("", {});
	}
	
});

Template.HomeJumbotron.helpers({
	
});

Template.HomeJumbotronJumbotronContent.events({

});

Template.HomeJumbotronJumbotronContent.helpers({

});


Template.HomeFeatures.events({

});

Template.HomeFeatures.helpers({

});


Template.HomeAboutus.events({

});

Template.HomeAboutus.helpers({

});


Template.HomeOrdernow.events({

});

Template.HomeOrdernow.helpers({

});

Template.HomeOrdernowInsertForm.rendered = function() {
	

	pageSession.set("homeOrdernowInsertFormInfoMessage", "");
	pageSession.set("homeOrdernowInsertFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		var date = new Date();
		date.setDate(date.getDate() + 1)

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format,
			startDate: date
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.HomeOrdernowInsertForm.events({

	"submit .form-orderNow": function(e, t) {

		e.preventDefault();
		pageSession.set("homeOrdernowInsertFormInfoMessage", "");
		pageSession.set("homeOrdernowInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {

			var homeOrdernowInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(homeOrdernowInsertFormMode) {
					case "insert": {
						pageSession.set("homeOrdernowInsertFormInfoMessage", msg);
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("homeOrdernowInsertFormInfoMessage", message);
					}; break;
				}
			}
			this.subscribe("yourorders");
			this.subscribe("yourcoupons");
			Router.go("/home", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("homeOrdernowInsertFormErrorMessage", message);
		}

		validateForm($(e.target), function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {

				 Meteor.call('orders.insertvalues', values, function(e) { 
					if(e) {

						errorAction(e); 
					} else {

						Template.HomeYourordersYourordersTable.rendered();

						submitAction("Your Order has been successfully placed, Thank you."); 
					}
				});

			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		Router.go("#section-welcome", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.HomeOrdernowInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("homeOrdernowInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("homeOrdernowInsertFormErrorMessage");
	}
	
});

Template.HomeYourorders.events({

});

Template.HomeYourordersYourordersTableItems.helpers({

	"formatDate": function (date) {
	 return moment(date).format('DD/MM/YYYY');
	},

	"formatCity": function (city) {
		 if(city === 'hyd'){
		 	return "Hyderabad";
		 } else {
		 	return "Hyderabad";
		 }
	},

	"formatWaterType": function (waterType) {
		 if(waterType === 'mineralwater'){
		 	return "Normal Mineral Water";
		 } else if(waterType === 'telanganajal'){
		 	return "Telangana Jal";
		 }
	},

});

var HomeYourordersYourordersItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	//var searchString = pageSession.get("HomeYourordersYourordersSearchString");
	var searchString = Meteor.userId();
	var sortBy = pageSession.get("HomeYourordersYourordersSortBy");
	var sortAscending = pageSession.get("HomeYourordersYourordersSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;

	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		//var searchFields = ["watertype", "mobileNo", "city", "locality", "address", "quantity", "startdate", "deliverytype"];
		var searchFields = ["createdBy"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};



var HomeYourordersYourordersExport = function(cursor, fileType) {
	var data = HomeYourordersYourordersItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.HomeYourordersYourorders.rendered = function() {
	pageSession.set("HomeYourordersYourordersStyle", "table");
	
};

Template.HomeYourordersYourorders.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("HomeYourordersYourordersSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("HomeYourordersYourordersSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("HomeYourordersYourordersSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		/**/
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		//HomeYourordersYourordersExport(this.yourorders.find({createdBy: Meteor.userId()}));
		HomeYourordersYourordersExport(this.yourorders, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		HomeYourordersYourordersExport(this.yourorders, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		HomeYourordersYourordersExport(this.yourorders, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		HomeYourordersYourordersExport(this.yourorders, "json");
	}

	
});

Template.HomeYourordersYourorders.helpers({

	

	"isEmpty": function() {
		return !this.yourorders || this.yourorders.count() == 0;
	},
	"isNotEmpty": function() {
		return this.yourorders && this.yourorders.count() > 0;
	},
	"isNotFound": function() {
		return this.yourorders && pageSession.get("HomeYourordersYourordersSearchString") && HomeYourordersYourordersItems(this.yourorders).length == 0;
	},
	"searchString": function() {
		return pageSession.get("HomeYourordersYourordersSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("HomeYourordersYourordersStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("HomeYourordersYourordersStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("HomeYourordersYourordersStyle") == "gallery";
	}

	
});


Template.HomeYourordersYourordersTable.rendered = function() {
	
};

Template.HomeYourordersYourordersTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("HomeYourordersYourordersSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("HomeYourordersYourordersSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("HomeYourordersYourordersSortAscending") || false;
			pageSession.set("HomeYourordersYourordersSortAscending", !sortAscending);
		} else {
			pageSession.set("HomeYourordersYourordersSortAscending", true);
		}
	}
});

Template.HomeYourordersYourordersTable.helpers({
	"tableItems": function() {
		return HomeYourordersYourordersItems(this.yourorders);
	}
});


Template.HomeYourordersYourordersTableItems.rendered = function() {
	
};

Template.HomeYourordersYourordersTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Orders.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Orders.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		/**/
		return false;
	},
	"click #cancel-order": function(e, t) {
		
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Cancel? Are you sure?",
			title: "Cancel",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {

						Meteor.call('orders.cancelorder', me._id, function(e) { 
							/*if(e) {

								errorAction(e); 
							} else {
								submitAction("Your Order has been successfully placed, Thank you."); 
							}*/
						});

						/*Orders.update({
							_id: this._id
						}, {
							$set:{
								status: "CANCELLED" 
							}
						});*/
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	}
});

Template.HomeYourordersYourordersTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	
	"isActive": function (status) {
		 if(status === 'ACTIVE'){
		 	return true;
		 } else {
		 	return false;
		 }
	},
	
});

Template.HomeYourCouponsYourCoupons.helpers({

	"isEmpty": function() {
		return !this.yourcoupons || this.yourcoupons.count() == 0;
	},
	"isNotEmpty": function() {
		return this.yourcoupons && this.yourcoupons.count() > 0;
	},
	"yourCoupons": function() {
		return this.yourcoupons.fetch();
	},
	"formatDate": function (date) {
	 return moment(date).format('DD/MM/YYYY');
	}	
});
