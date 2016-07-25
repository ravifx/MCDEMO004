
Meteor.methods({

'admin.isAdmin'() {

  	if(this.userId){

	  	const user = Meteor.users.findOne(this.userId);

		if(user && user.services && user.services.google && user.services.google.email && (user.services.google.email === 'ravifx@gmail.com' || user.services.google.email === 'azadfx@gmail.com')){
				return true;
			} else {
				return false;
			}
	  	}
	 }
});

