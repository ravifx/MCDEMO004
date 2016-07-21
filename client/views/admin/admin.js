var pageSession = new ReactiveDict();

Template.Admin.rendered = function() {
	
};

Template.AdminJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("", {});
	}
	
});


Template.DeliveriesTableItems.helpers({

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

