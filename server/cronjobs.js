
SyncedCron.start();

SyncedCron.add({
  name: 'Generate Daily Orders',
  schedule: function(parser) {
    //return parser.text('every 2 mins');
    return parser.recur().on(8).hour();
    //return parser.recur().on(15).minute();
  },
  job: function() {
    console.log("Corn Job Called :: "+ new Date());

    createTodaysDeliveries();

  }
});

var createTodaysDeliveries = function(){

	var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
	var yesterday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

	console.log("TODAY ::: +"+today);
	console.log("YESTERDAY ::: +"+yesterday);

	Orders.find({

		$and: [{fromdate:{$lt: today}}, {todate:{$gt: yesterday}}, {status: 'ACTIVE'},
			{$or: [{deliverytype:'Everyday'}, {deliverytype:'Onetime'},
				{$and:[{deliverytype:'AlternateDays'}, 
					{$where: function() { 
						return (((Math.round((today - this.fromdate)/86400000)) % 2) == 1);
						}
					}]
				}
			]
			}
		]

	}).forEach(function(doc){
	
		var deliverydata = {};

		deliverydata["userId"] = doc.createdBy;
		deliverydata["mobileNo"] = doc.mobileNo;
		deliverydata["city"] = doc.city;
		deliverydata["watertype"] = doc.watertype;
		deliverydata["quantity"] = doc.quantity;
		deliverydata["locality"] = doc.locality;
		deliverydata["address"] = doc.address;
		deliverydata["fromdate"] = doc.fromdate;
		deliverydata["todate"] = doc.todate;
		deliverydata["deliverytype"] = doc.deliverytype;
		deliverydata["deliverytime"] = doc.deliverytime;
		deliverydata["createdAt"] = new Date();
		deliverydata["status"] = "DRAFT";
		deliverydata["orderid"] = doc._id;

		deliverydata = deepen(deliverydata);

		Deliveries.insert(deliverydata);
});
}