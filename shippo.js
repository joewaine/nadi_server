var shippo = require('shippo')('shippo_live_b6790372812ed8e4f0c852e5f46801e3c8cddfd8');

var addressFrom  = {
    "name": "Shawn Ippotle",
    "street1": "215 Clayton St.",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94117",
    "country": "US"
};

var addressTo = {
    "name": "Mr Hippo",
    "street1": "Broadway 1",
    "city": "New York",
    "state": "NY",
    "zip": "10007",
    "country": "US"
};

var parcel = {
    "length": "5",
    "width": "5",
    "height": "5",
    "distance_unit": "in",
    "weight": "2",
    "mass_unit": "lb"
};

shippo.shipment.create({
    "address_from": addressFrom,
    "address_to": addressTo,
    "parcels": [parcel],
    "async": false
}, function(err, shipment){
    // asynchronously called

console.log(shipment.rates[shipment.rates.length - 2].servicelevel)
console.log(shipment.rates[shipment.rates.length - 2].carrier_account)



});

      
