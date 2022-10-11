var shippo = require('shippo')('shippo_live_b6790372812ed8e4f0c852e5f46801e3c8cddfd8');

//test token

// var shippo = require('shippo')('shippo_test_07bdc1b84901ae71dbdf63edfb718acbfaca2c11');



var addressFrom  = {
    "name": "sof elm",
    "company": "Mamnoon",
    "street1": "1508 Melrose Ave",
    "city": "Seattle",
    "state": "WA",
    "zip": "98112",
    "country": "US",
    "phone": "+1 425 442 9989",
    "email": "sofien@mamnoonrestaurant.com",
};

var addressTo = {
    "name": "joe waine",
    "company": "",
    "street1": "116 30th Ave",
    "street2": "",
    "city": "Seattle",
    "state": "WA",
    "zip": "98144",
    "country": "US",
    "phone": "+1 425 442 9308",
    "email": "joe@mamnoonrestaurant.com",
    "metadata": "Hippos dont lie"
};

var parcel = {
    "length": "5",
    "width": "5",
    "height": "5",
    "distance_unit": "in",
    "weight": "2",
    "mass_unit": "lb"
};

var shipment = {
    "address_from": addressFrom,
    "address_to": addressTo,
    "parcels": [parcel],
};

shippo.transaction.create({
    "shipment": shipment,
    "carrier_account": "decbd7bf0e6e471b9184f2fe29a4076f",
    "servicelevel_token": "usps_priority"
}, function(err, transaction) {
    // asynchronously called
    console.log(transaction)
});

            

