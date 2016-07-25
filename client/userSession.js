
Tracker.autorun(function() {
  if (Meteor.userId()) {

    Meteor.call('vendors.isVendor', "foo", function(error, result){
    if(result){
    	Session.set('isVendor', result);
    }else{
    	Session.set('isVendor', false);
    }
	});

	Meteor.call('admin.isAdmin', "foo", function(error, result){
		if(result){
	    	Session.set('isAdmin', result);
		}else{
			Session.set('isAdmin', false);
		}
	});
  } else {

  	Session.set('isAdmin', false);
  	Session.set('isVendor', false);
  }
});