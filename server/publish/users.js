Meteor.publish(null, function() {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId});
    } else {
        return null;
    }
}, {is_auto: true});
