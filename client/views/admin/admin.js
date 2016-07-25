var pageSession = new ReactiveDict();

Template.Admin.rendered = function() {
	
};

Template.AdminJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("", {});
	}
	
});


Template.AdminVendorInsertForm.rendered = function() {
	

	pageSession.set("adminVendorInsertFormInfoMessage", "");
	pageSession.set("adminVendorInsertFormErrorMessage", "");

	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.AdminVendorInsertForm.events({

	"submit .form-orderNow": function(e, t) {

		e.preventDefault();
		pageSession.set("adminVendorInsertFormInfoMessage", "");
		pageSession.set("adminVendorInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {

			var adminVendorInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminVendorInsertFormMode) {
					case "insert": {

						pageSession.set("adminVendorInsertFormInfoMessage", msg);
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminVendorInsertFormInfoMessage", message);
					}; break;
				}
			}

			//this.subscribe("yourvendors");
			Router.go("/admin", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("adminVendorInsertFormErrorMessage", message);
		}

		validateForm($(e.target), function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {


				var vendorswithsamemail = Vendors.find({email:values.email}).fetch();

				if(vendorswithsamemail && vendorswithsamemail.length > 0){
					errorAction("A vendor was already registered with this email, Please use another email"); 
				}else{

					var vendorsforsamelocality = Vendors.find({locality:values.locality, city:values.city}).fetch();

					if(vendorsforsamelocality && vendorsforsamelocality.length > 0){
						errorAction("A vendor was already registered for this locality"); 
					} else {
						Meteor.call('vendors.insert', values, function(e) { 
						if(e) {

							errorAction(e); 
						} else {

							submitAction("Vendor has been successfully created, Thank you."); 

						}
					});
					}
				}
			}
		);

		return false;
	}
	
});

Template.AdminVendorInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminVendorInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminVendorInsertFormErrorMessage");
	}
	
});

Template.VendorTableItems.helpers({

	"formatCity": function (city) {
		 if(city === 'hyd'){
		 	return "Hyderabad";
		 } else {
		 	return "Hyderabad";
		 }
	},
	"isActive": function (status) {
		 if(status === 'ACTIVE'){
		 	return true;
		 } else {
		 	return false;
		 }
	}


});

var VendorTableItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("YourVendorsSearchString");
	var sortBy = pageSession.get("AdminYourVendorsSortBy");
	var sortAscending = pageSession.get("AdminYourVendorsSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];

	if(!searchString || searchString == "") {
		filtered = raw;

	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "mobileNo", "email", "city", "locality", "address", "createdAt", "status"];
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

Template.Vendors.rendered = function() {
	pageSession.set("AdminYourVendorsStyle", "table");
	
};

Template.Vendors.events({
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
				pageSession.set("YourVendorsSearchString", searchString);
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
					pageSession.set("YourVendorsSearchString", searchString);
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
					pageSession.set("YourVendorsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		/**/
	}
	
});


Template.VendorsContent.helpers({

	"isEmpty": function() {
		return !this.yourvendors || this.yourvendors.count() == 0;
	},
	"isNotEmpty": function() {
		return this.yourvendors && this.yourvendors.count() > 0;
	},
	"isNotFound": function() {
		return this.yourvendors && pageSession.get("YourVendorsSearchString") && VendorTableItems(this.yourvendors).length == 0;
	},
	"searchString": function() {
		return pageSession.get("YourVendorsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminYourVendorsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminYourVendorsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminYourVendorsStyle") == "gallery";
	}
	
});

Template.VendorsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminYourVendorsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminYourVendorsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminYourVendorsSortAscending") || false;
			pageSession.set("AdminYourVendorsSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminYourVendorsSortAscending", true);
		}
	}
});

Template.VendorsTable.helpers({
	"tableItems": function() {
		return VendorTableItems(this.yourvendors);
	}
});


Template.VendorTableItems.rendered = function() {
	
};

Template.VendorTableItems.events({
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
	
	"click #edit-button": function(e, t) {
		e.preventDefault();
		/**/
		return false;
	},
	"click #Cancel-Vendor": function(e, t) {
		
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

						Meteor.call('vendors.cancel', me._id, function(e) { 
							console.log("IN SIDE CANCEL VENDOR");
						});

						Meteor.subscribe(this.yourvendors);
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

Template.DeliveriesTableItems.helpers({

	"checked": function(value) { return value ? "checked" : "" },

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

	"isDraft": function (status) {
		 if(status === 'DRAFT'){
		 	return true;
		 } else {
		 	return false;
		 }
	}

});

var DeliveriesTableItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("YourDeliveriesSearchString");
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
		var searchFields = ["watertype", "mobileNo", "city", "locality", "address", "quantity", "createdAt", "status"];
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
	var data = DeliveriesTableItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.Deliveries.rendered = function() {
	pageSession.set("HomeYourordersYourordersStyle", "table");
	
};

Template.Deliveries.events({
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
				pageSession.set("YourDeliveriesSearchString", searchString);
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
					pageSession.set("YourDeliveriesSearchString", searchString);
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
					pageSession.set("YourDeliveriesSearchString", "");
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
		HomeYourordersYourordersExport(this.yourdeliveries, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		HomeYourordersYourordersExport(this.yourdeliveries, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		HomeYourordersYourordersExport(this.yourdeliveries, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		HomeYourordersYourordersExport(this.yourdeliveries, "json");
	}
	
});

Template.DeliveriesContent.helpers({

	"isEmpty": function() {
		return !this.yourdeliveries || this.yourdeliveries.count() == 0;
	},
	"isNotEmpty": function() {
		return this.yourdeliveries && this.yourdeliveries.count() > 0;
	},
	"isNotFound": function() {
		return this.yourdeliveries && pageSession.get("YourDeliveriesSearchString") && DeliveriesTableItems(this.yourdeliveries).length == 0;
	},
	"searchString": function() {
		return pageSession.get("YourDeliveriesSearchString");
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

Template.DeliveriesTable.events({
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

Template.DeliveriesTable.helpers({
	"tableItems": function() {
		return DeliveriesTableItems(this.yourdeliveries);
	}
});


Template.DeliveriesTableItems.rendered = function() {
	
};

Template.DeliveriesTableItems.events({
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
	"click #Confirm-Delivery": function(e, t) {
		
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delivered? Are you sure?",
			title: "Confirm Delivery",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {

						Meteor.call('deliveries.confirmdelivery', me._id, function(e) { 
							/*if(e) {

								errorAction(e); 
							} else {
								submitAction("Your Order has been successfully placed, Thank you."); 
							}*/
						});

						Meteor.subscribe(this.yourdeliveries);
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

Template.DeliveriesTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	
	"isDraft": function (status) {
		 if(status === 'DRAFT'){
		 	return true;
		 } else {
		 	return false;
		 }
	},
	
});

