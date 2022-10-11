const Order = require("../model/Order");
const fetch = require("node-fetch");
const btoa = require("btoa");
const axios = require("axios");
const e = require("express");
const moment = require('moment');
var sdk = require("emergepay-sdk");







const today = moment().tz("America/Los_Angeles").startOf('day');

// console.log(today);
// console.log(today);

const oloOrder = require('../helpers/oloOrder')

const oloOrderStreet = require('../helpers/oloOrderStreet')
const postOrder = require('../helpers/postOrder')
const postOrderStreet = require('../helpers/postOrderStreet')
const {fNameAndConfirmCode, contactInfo, fullAddressAndName, sendVoidReturnCancelEmail, cancelConfirmCode, itemList}
= require('../../emails/emailTemplateHelpers')








const nodemailer = require("nodemailer");

// production
var oid = process.env.GRAVITY_PROD_OID;
var authToken = process.env.GRAVITY_PROD_AUTH_TOKEN;
var environmentUrl = process.env.GRAVITY_PROD_ENVIRONMENT_URL;

//sandbox
// var oid = process.env.GRAVITY_SANDBOX_OID;
// var authToken = process.env.GRAVITY_SANDBOX_AUTH_TOKEN  
// var environmentUrl = process.env.GRAVITY_SANDBOX_ENVIRONMENT_URL;



var emergepay = new sdk.emergepaySdk({
  oid: oid,
  authToken: authToken,
  environmentUrl: environmentUrl,
});




exports.tipRefundTrue =  async function (req,res){
  console.log(req.params.id);
    try {
  
      let doc = await Order.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $set: {
            tipRefunded: true
          },
        },
        function (err, doc) {}
      );
      console.log("you just got one");
      res.status(201).json({ doc });

      console.log(doc);

    } catch (err) {
      console.log(err);
    }
  };


exports.partialRefundTrue =  async function (req,res){
  console.log(req.params.id);
    try {
  
      let doc = await Order.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $set: {
            partialFixedRefund:true
          },
        },
        function (err, doc) {}
      );
      console.log("you just got one");
      res.status(201).json({ doc });

      console.log(doc);

    } catch (err) {
      console.log(err);
    }
  };
  







exports.cancelPreOrder = async (req, res) => {
  console.log(req.params.id);
    try {
  
      let doc = await Order.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $set: {
            cancelled: true,
            orderPosted: true,
            status: "Closed",
            timeClosed: Date.now() 
          },
        },
        function (err, doc) {}
      );
      console.log("you just got one");
      res.status(201).json({ doc });
      sendVoidReturnCancelEmail(doc,'cancel');
  
    } catch (err) {
      console.log(err);
    }
  };
  
















exports.tokenizedReturn = function (req, res) {

  console.log('tokenized return')
  console.log('tokenized return')
  console.log('tokenized return')
  // Ensure that you supply a valid uniqueTransId before trying to run the tokenized payment.
  emergepay
    .tokenizedRefundTransaction({
      uniqueTransId: req.body.uniqueTransId,
      externalTransactionId: emergepay.getExternalTransactionId(),
      amount: req.body.amount,
    })
    .then(function (response) {
      var data = response.data;
      console.log(data);

      res.send({ data });

      updateRefundAmount(req.body.uniqueTransId,req.body.amount*100);


    })
    .catch(function (error) {
      throw error;
    });
};

// dcda9c2810df4b4093e3c3e9636023f4-b7339528a18f44338d3279c0542ae652

let updateRefundAmount = async (uniqueTransId,amount) =>{

console.log('refund amount');
console.log(uniqueTransId);
console.log(amount);


  try {
    // let doc = await Order.findById('5f97465eebb3b9108bc2a50b')

    let doc = await Order.findOneAndUpdate(
      { "payInfo.uniqueTransId": uniqueTransId },
      { $inc: { amountRefunded: amount } },
      function (err, doc) {

console.log(doc);

      }
    );
    console.log("primary giftcard updated to true id");
    // res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }



}





exports.getCustomerEmails = async (req,res) => {


  try {

    let docs = await Order.find();
      let arr = docs.map(function(x){
        return x.email.split("@")[1];

      });

    var set = new Set(arr);
    let domains = [...set];

    res.send({domains});

  } catch (err) {
    console.log(err);
  }
}





exports.issueVoid = function (req, res) {
  console.log("issueVoid");
  console.log(req.body.uniqueTransId);
  //Ensure uniqueTransId is set to the id of the transaction to void
  emergepay
    .voidTransaction({
      uniqueTransId: req.body.uniqueTransId,
      externalTransactionId: emergepay.getExternalTransactionId(),
    })
    .then(function (response) {
      var transactionResponse = response.data;

      // updateVoidInMongo(req.body.uniqueTransId);

      console.log(transactionResponse);
      res.send({ transactionResponse });
    })
    .catch(function (error) {
      throw error;
    });
};

exports.lookUpOrderConfirmationCode = async (req, res) => {
  try {
    Order.findOne(
      { "orderInfo.confirmation_code": req.body.orderInfo.confirmation_code },
      (err, confirmationCode) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (confirmationCode === null) {
            addOrderConfirmed(req);
            res
              .status(200)
              .json({ confirmationCode: req.body.orderInfo.confirmation_code });
          } else {
            console.log("this confirmation already exists");
          }
        }
      }
    );
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

let addOrderConfirmed = async (req) => {
  console.log("add order confirmed");
  // exports.addOrder = async (req, res) => {
  // console.log(req.body)
  let sandbox;
  if(oid === process.env.GRAVITY_SANDBOX_OID){
    sandbox = true;
  } else {
    sandbox = false;
  }

  try {


    
    const order = new Order({
      sandbox,
      timeClosed: null,
      email: req.body.orderInfo.fulfillment_info.customer.email,
      payInfo: req.body.payInfo,
      orderInfo: req.body.orderInfo,
      void: false,
      upserveId: req.body.orderInfo.id,
      status: "Open",
      orderPosted: false,
      orderAccepted: false,
      shippingOrder:
        req.body.orderInfo.fulfillment_info.type === "delivery" ? true : false,
      shipped: false,
      shippingInfo: { order: "empty" },
      acceptanceEmailSent: false,
      readyEmailSent: false,
      cancelled: false,
      partialFixedRefund:false,
      amountRefunded: 0,
      tipRefunded: false
    });

    await order.save();

    // let data = await order.save();
    // res.json({ data });
    // console.log(order)
    // res.status(200).json({data});
    // res.status(200).json({ data });
    // console.log('success');
  } catch (err) {
    // res.status(400).json({ err: err });
    console.log("error");
  }
};

exports.retrieveOrders = async (req, res) => {
  console.log(req.params.email);
  try {
    const user = await Order.findByOrderEmail(req.params.email);

    res.status(201).json({ user });
  } catch (err) {}
};

exports.allOrders = async (req, res) => {
  try {
    const user = await Order.find();
    res.status(201).json({ user });
  } catch (err) {}
};



exports.loadOrderById = async (req, res) => {


  try {
    const user = await Order.findOne({
      "_id": req.params.id
    });
    console.log(user);
    res.status(201).json({user});
  } catch(err){
    console.log('caught in catch block')
  }



}






exports.todaysOrderHistory = async (req, res) => {
// console.log('todays order hsitory');

// console.log('todays order hsitory');
// console.log('todays order hsitory');
// console.log('todays order hsitory');
// console.log(today);
// console.log(moment(today).startOf('day').valueOf());
// console.log(moment(today).startOf('day').valueOf());
// console.log(moment(today));
// console.log(moment(today).startOf('day'));

  try {

  
    const orders = await Order.find({});



let user = correctTimeFrame(orders,today);
// console.log(user);

    res.status(201).json({user});
  } catch(err){
    console.log('caught in catch block')
  }
}

let correctTimeFrame = function(orders,date){
  
  let user = [];
  for(let i=0; i<orders.length; i++){

    if(moment(orders[i].orderInfo.fulfillment_info.estimated_fulfillment_time).valueOf() < moment(date).tz("America/Los_Angeles").endOf('day').valueOf() && moment(orders[i].orderInfo.fulfillment_info.estimated_fulfillment_time).valueOf() > moment(date).tz("America/Los_Angeles").startOf('day').valueOf()){
        user.push(orders[i])
    }

}

return user;



}

exports.retrieveByDate = async (req, res) => {
console.log('by date');
    try {
  

      const orders = await Order.find({});


   
      let user = correctTimeFrame(orders,req.params.date);







      res.status(201).json({user});
    } catch(err){
      console.log('caught in catch block')
    }
  }




  exports.retrievePreOrders = async (req,res) => {



    try {
      const preorder = await Order.find({
        "orderInfo.preorder": true
      });
      console.log(preorder.length);

      console.log('preorders');
      console.log(preorder);
      res.status(201).json({preorder});
    } catch(err){
      console.log('caught in catch block')
    }
  }









exports.togglingOnlineOrders = async (req) => {
  console.dir(req.params)
  console.log(`toggled is ${req.params.toggled}`)
  return req.params.toggled;
}


exports.acceptingOrdersBoolean = async (req, res) => {
  if (req.params.restaurant === "MamnoonStreet") {
    let reqBody = {
      timeStamp: 1628549888969,
      tipSelected: 0,
      currentAmountToAddCustom: 0,
      sms: false,
      restaurant: "Mamnoon Street",
      billing: {
        billing_name: "joseph p waine",
        billing_address: "116 30th Ave S 1",
        billing_postal_code: "98122",
      },
      id: "d0xbpr89c87_3khgfpg4jwr_558znsgh569",
      preorder: false,
      scheduled_time: null,
      time_placed: "2021-08-09T23:14:43.710Z",
      confirmation_code: "mamnoon-f1c6yhtmrno",
      charges: {
        total: 0,
        preTotal: 0,
        fees: 0,
        taxes: 0,
        tip: {
          amountOptions: [0, 0, 0, 0, 0],
          amount: 0,
          payment_type: "Nadi Mama",
        },
        items: [],
      },
      fulfillment_info: {
        type: "pickup",
        estimated_fulfillment_time: "2021-08-09T23:14:43.710Z",
        customer: {
          email: "joe@mamnoonrestaurant.com",
          phone: "4254429308",
          first_name: "joe",
        },
        instructions: "",
        no_tableware: false,
        delivery_info: {
          is_managed_delivery: false,
          address: {
            city: "seattle",
            state: "WA",
            zip_code: "98144",
            address_line1: "1745 12th Avenue South",
            address_line2: "#2",
          },
        },
      },
      payments: {
        payments: [
          {
            payment_type: "Nadi Mama",
            amount: 0,
          },
        ],
      },
    };

    axios
      .post("https://hq.breadcrumb.com/ws/v1/orders", reqBody, {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
          "X-Breadcrumb-Password": "TJzwaP8uguyy",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      })
      .then(function (response) {
        let resData = response.data;
        // console.log(response)
        console.log(req.params.restaurant);
        console.log("resData from boolean");
        console.log(resData);
        //  if (resData.result === 'success') {
        res.send(resData);
        //  }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (req.params.restaurant === "Mamnoon") {
    let reqBody = {
      timeStamp: 1627593967907,
      tipSelected: 0,
      currentAmountToAddCustom: 0,
      sms: false,
      restaurant: "Mamnoon",
      billing: {
        billing_name: "test nadi mama",
        billing_address: "116 30th Ave N 1",
        billing_postal_code: "98122",
      },
      id: "t5zmhdlsp3f_la1l6urj7t_26ujiucja6t",
      preorder: false,
      scheduled_time: null,
      time_placed: "2021-07-29T21:26:43.604Z",
      confirmation_code: "mamnoon-801y6jxgtwy",
      charges: {
        total: 0,
        preTotal: 0,
        fees: 0,
        taxes: 0,
        tip: {
          amountOptions: [0, 18, 22, 25, 0],
          amount: 0,
          payment_type: "Nadi Mama",
        },
        items: [],
      },
      fulfillment_info: {
        type: "pickup",
        estimated_fulfillment_time: "2021-07-29T21:26:43.604Z",
        customer: {
          email: "info@mamnoonrestaurant.com",
          phone: "3914429308",
          first_name: "test",
        },
        instructions: "",
        no_tableware: false,
        delivery_info: {
          is_managed_delivery: false,
          address: {
            city: "seattle",
            state: "WA",
            zip_code: "98144",
            address_line1: "1745 12th Avenue South",
            address_line2: "#2",
          },
        },
      },
      payments: {
        payments: [
          {
            payment_type: "Nadi Mama",
            amount: 0,
          },
        ],
      },
    };

    axios
      .post("https://hq.breadcrumb.com/ws/v1/orders", reqBody, {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
          "X-Breadcrumb-Password": "uQM8mseTvnTX",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      })
      .then(function (response) {
        let resData = response.data;
        // console.log(response)

        console.log("resData from boolean");
        console.log(resData);
        //  if (resData.result === 'success') {
        res.send(resData);
        //  }
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  
};

exports.pollingRequest = function (req, res) {
  //  console.log(req.query)

  emergepay
    .retrieveTransaction(req.query.externalTransactionId)
    .then(function (response) {
      var transactionResponse = response.data;
      //  console.log(transactionResponse)

      //  transactionResponse
      res.send({ transactionResponse });
    })
    .catch(function (error) {
      throw error;
    });
};

exports.startTransactionRetail = function (req, res) {
  // console.log(req.body)
  console.log("START TRANSACTION RETAIL");
  console.log("START TRANSACTION RETAIL");
  console.log("START TRANSACTION RETAIL");
  console.log("START TRANSACTION RETAIL");
  console.log("START TRANSACTION RETAIL");

  let shipping;
  if (req.body.charges.shipping) {
    shipping = Number(req.body.charges.shipping) * 100;
    console.log(Number(req.body.charges.shipping) * 100);
  } else {
    shipping = 0;
    console.log("no shipping");
  }

  let amount = Number(req.body.charges.total) + Number(shipping);


  let finalAmount = amount;
  let finalCash = finalAmount / 100;

  console.log(finalCash);

  console.log(req.body.billing);

  let config = {
    transactionType: sdk.TransactionType.CreditSale,
    method: "modal",
    fields: [
      {
        id: "base_amount",
        value: finalCash.toString(),
      },
      {
        id: "billing_name",
        value: req.body.billing.billing_name,
      },
      {
        id: "billing_address",
        value: req.body.billing.billing_address,
      },
      {
        id: "billing_postal_code",
        value: req.body.billing.billing_postal_code,
      },
      {
        id: "external_tran_id",
        value: emergepay.getExternalTransactionId(),
      },
      {
        id: "tip_amount",
        //  value: formattedTipAmount.toString(),
        value: "0",
      },
    ],
  };

  console.log("config");
  console.log("config");
  console.log("config");
  console.log(config);

  emergepay
    .startTransaction(config)
    .then(function (transactionToken) {
      console.log(transactionToken);
      res.send({
        transactionToken: transactionToken,
      });
    })
    .catch(function (err) {
      console.log("error");
      res.send(err.message);
    });
};

exports.startTransaction = function (req, res) {
  console.log(req.body);

  let shipping;
  if (req.body.charges.shipping) {
    shipping = Number(req.body.charges.shipping) * 100;
    console.log(Number(req.body.charges.shipping) * 100);
  } else {
    shipping = 0;
    console.log("no shipping");
  }

  let amount =
    Number(req.body.charges.total) - Number(req.body.charges.tip.amount);
  let tipAmount = Number(req.body.charges.tip.amount);

  let toFixed = tipAmount / 100;

  let formattedTipAmount = toFixed.toFixed(2);

  let finalAmount = amount;
  let finalCash = finalAmount / 100;

  let config = {
    transactionType: sdk.TransactionType.CreditSale,
    method: "modal",
    fields: [
      {
        id: "base_amount",
        value: finalCash.toString(),
      },
      {
        id: "billing_name",
        value: req.body.billing.billing_name,
      },
      {
        id: "billing_address",
        value: req.body.billing.billing_address,
      },
      {
        id: "billing_postal_code",
        value: req.body.billing.billing_postal_code,
      },
      {
        id: "external_tran_id",
         value: emergepay.getExternalTransactionId(),
        // value: "8d40092f-54a1-46ac-9300-0ada024f1573",
      },
      {
        id: "tip_amount",
        value: formattedTipAmount.toString(),
      },
    ],
  };
  console.log(config);

  emergepay
    .startTransaction(config)
    .then(function (transactionToken) {
      console.log(transactionToken);
      res.send({
        transactionToken: transactionToken,
      });
    })
    .catch(function (err) {
      console.log("error");
      res.send(err.message);
    });
};

exports.startAuth = function (req, res) {
  console.log("start auth");
  //  console.log(req);

  console.log(req.body);
  let shipping;
  if (req.body.charges.shipping) {
    shipping = Number(req.body.charges.shipping) * 100;
    console.log(Number(req.body.charges.shipping) * 100);
  } else {
    shipping = 0;
    console.log("no shipping");
  }

  let amount =
    Number(req.body.charges.total) - Number(req.body.charges.tip.amount);
  let tipAmount = Number(req.body.charges.tip.amount);

  let toFixed = tipAmount / 100;

  let formattedTipAmount = toFixed.toFixed(2);

  let finalAmount = amount;
  let finalCash = finalAmount / 100;


console.log('req.body.confirmation_code');
console.log(req.body.confirmation_code);

  let config = {
    transactionType: sdk.TransactionType.CreditAuth,
    transactionReference: req.body.confirmation_code,
    method: "modal",
    fields: [
      {
        id: "base_amount",
        value: finalCash.toString(),
      },
      {
        id: "billing_name",
        value: req.body.billing.billing_name,
      },
      {
        id: "billing_address",
        value: req.body.billing.billing_address,
      },
      {
        id: "billing_postal_code",
        value: req.body.billing.billing_postal_code,
      },
      {
        id: "external_tran_id",
        //  value: emergepay.getExternalTransactionId(),
        //  value: '8d40092f-54a1-46ac-9300-0ada024f1573'
        value: emergepay.getExternalTransactionId(),
      },
      {
        id: "tip_amount",
        value: formattedTipAmount.toString(),
      },
    ],
  };
  // console.log(config)

  emergepay
    .startTransaction(config)
    .then(function (transactionToken) {
      console.log(transactionToken);
      res.send({
        transactionToken: transactionToken
      });
    })
    .catch(function (err) {
      console.log(err);
      console.log("error");
      res.send(err.message);
    });
};

exports.voidByTransIDMongo = async (req, res) => {
  console.log("void by trans id");
  console.log(req.body.uniqueTransId);


  try {
    let filter = { "payInfo.uniqueTransId": req.body.uniqueTransId };
    const update = { void: true };
    let doc = await Order.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });

    res.status(201).json({ doc });


    sendVoidReturnCancelEmail(doc,'void');
  } catch (err) {
    console.log(error);
  }
};

exports.lookUpGiftCard = async (req, res) => {

  // console.log("look up giftcard");
  // console.log(typeof(req.body.cardNumber));
  // console.log(req.body.cardNumber);

  // console.log("look up giftcard order or user controller?");
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = mm + "/" + dd + "/" + yyyy;

  let currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });
  let currentTimeSliced = currentTime.replace(" ", "");

  var xmlBodyStr = `request=<?xml version="1.0"?>
      <Trans>
      <Header>
          <FmtType>ClientWeb</FmtType>
          <FmtVer>1.0.0</FmtVer>
          <Uid>A7FEDD8B-BF2C-4D63-917D-4C1130ABFE4E</Uid>
          <Client>1047</Client>
          <ClientCode>B5C7A5CD-CAFB-4BE7-90F5-1A5ACB29292A</ClientCode>
          <Location>99992</Location>
          <Server>123</Server>
          <TransDate>${today}</TransDate>
          <TransTime>${currentTimeSliced}</TransTime>
          <POSSerial>12345</POSSerial>
      </Header>
      <Requests>
      <SvInquiry>
      <CardNbr>
      ${req.body.cardNumber}
      </CardNbr>
      </SvInquiry>
      </Requests>
      </Trans>`;

  var config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  axios
    .post("https://portal2.custcon.com/Partner/ProcessXml", xmlBodyStr, config)
    .then((response) => {
      let resData = response.data;
      // // console.log(resData)
      let resSendData = null;

      parseString(resData, function (err, result) {
        resSendData = result["Trans"];
      });
      res.send(201).json({ resSendData });
    })
    .catch((err) => {
      // // console.log(err)
      res.status(400).json({ err: err });
    });
};

exports.useGiftCard = async (req, res) => {
  console.log("use giftcard");
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = mm + "/" + dd + "/" + yyyy;

  let currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });
  let currentTimeSliced = currentTime.replace(" ", "");
  var xmlBodyStr = `request=<?xml version="1.0"?>
        <Trans>
        <Header>
        <FmtType>ClientWeb</FmtType>
        <FmtVer>1.0.0</FmtVer>
        <Uid>A7FEDD8B-BF2C-4D63-917D-4C1130ABFE4E</Uid>
        <Client>1047</Client>
        <ClientCode>B5C7A5CD-CAFB-4BE7-90F5-1A5ACB29292A</ClientCode>
        <Location>99992</Location>
        <Server>123</Server>
        <TransDate>${today}</TransDate>
        <TransTime>${currentTimeSliced}</TransTime>
        <POSSerial>12345</POSSerial>
        </Header>
        <Requests>
        <SvUse>
        <CardNbr>
        ${req.body.cardNumber}
        </CardNbr>
        <Amount>${req.body.useAmount}</Amount>
        </SvUse>
        </Requests>
        </Trans>`;

  var config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  //  axios.post('http://test.portal.custcon.com/Partner/ProcessXml', xmlBodyStr, config).then(response => {

  console.log(req.body);
  axios
    .post("https://portal2.custcon.com/Partner/ProcessXml", xmlBodyStr, config)
    .then((response) => {
      let resData = response.data;
      let resSendData = null;
      // console.log(resData)
      parseString(resData, function (err, result) {
        resSendData = result["Trans"];
      });

      res.send(201).json({ resSendData });
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};







exports.cancelPreOrder = async (req, res) => {
console.log(req.params.id);
  try {


    let doc = await Order.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          cancelled: true,
          orderPosted: true,
          status: "Closed",
          timeClosed: Date.now() 
        },
      },
      function (err, doc) {}
    );
    console.log("you just got one");
    res.status(201).json({ doc });
    sendVoidReturnCancelEmail(doc,'cancel');



  } catch (err) {
    console.log(err);
  }
};






















exports.updateRefundItemsMongo = async (req, res) => {

  try {


    let doc = await Order.findOneAndUpdate(
      {
        _id: req.body.orderId,
        "orderInfo.charges.items.cartId": req.body.cartId,
      },
      {
        $set: {
          "orderInfo.charges.items.$.returned": true,
        },
      },
      function (err, doc) {}
    );

    console.log("you just got one");
    res.status(201).json({ doc });

    sendVoidReturnCancelEmail(doc,'return');

  } catch (err) {
    console.log(err);
  }
};

exports.markAsShipped = async (req, res) => {

  try {
    const filter = { _id: req.body.uniqueId };
    const update = { shipped: true };
    console.log(filter);
    let doc = await Order.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });

    res.status(201).json({ doc });

    sendShippingConfirmationEmail(req.body.order);
  } catch (err) {
    console.log(error);
  }
};

let sendShippingConfirmationEmail = async (req) => {
  console.log("send shipping confirmation");
  let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}Your Retail Order Has Shipped!</h1></div><p style="text-align: center;margin: 0 auto;width: 100%;"><br>Your order has shipped!<br>Your Tracking Number is: ${req.shippingInfo.tracking_number}<br><a target="_blank" href="${req.shippingInfo.tracking_url_provider}">Track your package</a><br><br><span style="font-size: 20px !important;">confirmation code: <b>${req.orderInfo.confirmation_code}</b></span><br/></p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;"">`;
  // for (let i = 0; i < req.orderInfo.charges.items.length; i++) {
  //   htmlBody =
  //     htmlBody +
  //     '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
  //     JSON.stringify(req.orderInfo.charges.items[i].name) +
  //     "&nbsp;<b>$" +
  //     JSON.stringify(req.orderInfo.charges.items[i].price) / 100 +
  //     "</b>&nbsp;x&nbsp;" +
  //     JSON.stringify(req.orderInfo.charges.items[i].quantity) +
  //     "</li>";
  // }


  htmlBody = htmlBody + itemList(req.orderInfo);









  htmlBody =
    htmlBody +
    `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at Mamnoon.<br><br><i>'1508 Melrose Ave, Seattle, WA 98122'</i><br><a href="https://nadimama.com">nadimama.com</a><br/>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a></p>`;

  var mailOptions5 = {
    from: "orders@mamnoonrestaurant.com",
    to: req.email,
    // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
    subject: `${process.env.LOCAL_ENVIRONMENT}YOUR RETAIL ORDER HAS SHIPPED`,
    html: htmlBody,
  };



  const sendMail = function (mailOptions, transporter) {
    console.log();
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          console.log("email sent");
          resolve(info);
        }
      });
    });
  };

  sendMail(mailOptions5, transporter);
};

exports.startCreditSave = async (req, res) => {

  console.log('req.body');
  console.log(req.body);

  var config = {
    transactionType: sdk.TransactionType.CreditSaveCard,
    method: "modal",
    fields: [
        {
            id: "external_tran_id",
            value: emergepay.getExternalTransactionId()
        }
    ]
};


  emergepay.startTransaction(config)
  .then(function (transactionToken) {

    console.log(transactionToken);
      res.send({
          transactionToken: transactionToken
      });
  })
  .catch(function (err) {
      res.send(err.message);
  });

};





exports.checkOlo = async (req, res) => {
  console.log(req.params.restaurant);

  try {
  } catch (err) {}
};



/////////// ##### moving functions from index.js ##### ///////////

 exports.oloOrder = async (req, res) => {

  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req.body, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
        "X-Breadcrumb-Password": "uQM8mseTvnTX",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;

      oloOrder.postOrder(req, resData, res);


      
/// .catch(soething)
}).catch(function (error) {
  


res.send({ error });




});

};


exports.oloOrderStreet = async (req, res) => {

  console.log('street order')

  console.log('street order')

  console.log('street order')
  console.log('street order')

  console.log('street order')

  console.log('street order')

  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req.body, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
        "X-Breadcrumb-Password": "TJzwaP8uguyy",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;
      oloOrderStreet.postOloOrderStreet(req, resData, res);
    }).catch(function(error){
      res.send({ error });
    })
}




exports.postOrder = async (req, res) => {
  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
        "X-Breadcrumb-Password": "uQM8mseTvnTX",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;
      postOrder.postOrder(req, resData, res);
    }).catch(function(error){
      console.error(error);
    })
}

exports.postOrderStreet = async (req, res) => {
  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
        "X-Breadcrumb-Password": "TJzwaP8uguyy",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;
      postOrderStreet.postOrderStreet(req, resData, res)
    }).catch(function(error){
      console.error(error);
    })
}



let bogusBody={
  "timestamp": 1638914119360,
  "tipselected": 0,
  "currentamounttoaddcustom": 0,
  "sms": false,
  "restaurant": "mamnoon",
  "billing": {
    "billing_name": "joseph p waine",
    "billing_address": "1745 12th avenue south #2",
    "billing_address_city": "seattle",
    "billing_address_state": "wa",
    "billing_postal_code": "98222"
  },
  "id": 1234567,
  "preorder": false,
  "scheduled_time": null,
  "time_placed": "2021-12-07t21:55:27.754z",
  "confirmation_code": "mamnoon-zxjllxc3ytk",
  "charges": {
    "total": 0,
    "pretotal": 0,
    "fees": 0,
    "taxes": 0,
    "tip": {
      "amountoptions": [
        0,
        0,
        0,
        0,
        0
      ],
      "amount": 0,
      "payment_type": "generic online ordering integrated"
    },
    "items": []
  },
  "fulfillment_info": {
    "type": "pickup",
    "estimated_fulfillment_time": "2021-12-07t21:55:27.754z",
    "customer": {
      "email": "joe.waine@gmail.com",
      "phone": "4254429308",
      "first_name": "joe waine",
      "last_name": "spriggs"
    },
    "instructions": "",
    "no_tableware": false,
    "delivery_info": {
      "is_managed_delivery": false,
      "address": {
        "city": "",
        "state": "",
        "zip_code": "",
        "address_line1": "",
        "address_line2": ""
      }
    }
  }
}


let good = {
  "timestamp": 1638914119360,
  "tipselected": 0,
  "currentamounttoaddcustom": 0,
  "sms": false,
  "restaurant": "mamnoon",
  "billing": {
    "billing_name": "joseph p waine",
    "billing_address": "1745 12th avenue south #2",
    "billing_address_city": "seattle",
    "billing_address_state": "wa",
    "billing_postal_code": "98222"
  },
  "id": "2lt2zbhuq33_d4f6fwhypj_ddp6iz1oun5",
  "preorder": false,
  "scheduled_time": null,
  "time_placed": "2021-12-07t21:55:27.754z",
  "confirmation_code": "mamnoon-zxjllxc3ytk",
  "charges": {
    "total": 0,
    "pretotal": 0,
    "fees": 0,
    "taxes": 0,
    "tip": {
      "amountoptions": [
        0,
        0,
        0,
        0,
        0
      ],
      "amount": 0,
      "payment_type": "generic online ordering integrated"
    },
    "items": []
  },
  "fulfillment_info": {
    "type": "pickup",
    "estimated_fulfillment_time": "2021-12-07t21:55:27.754z",
    "customer": {
      "email": "joe.waine@gmail.com",
      "phone": "4254429308",
      "first_name": "joe waine",
      "last_name": "spriggs"
    },
    "instructions": "",
    "no_tableware": false,
    "delivery_info": {
      "is_managed_delivery": false,
      "address": {
        "city": "",
        "state": "",
        "zip_code": "",
        "address_line1": "",
        "address_line2": ""
      }
    }
  },
  "payments": {
    "payments": [
      {
        "payment_type": "generic online ordering integrated",
        "amount": 0
      }
    ]
  }
}

async function bogusOrderoloOrder(bogus){
console.log('bogus')
console.log('bogus')
console.log('bogus')
  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", bogus, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
        "X-Breadcrumb-Password": "uQM8mseTvnTX",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
console.log(response);
console.log('success')
}).catch(function (error) {
  console.log(error)
});

};

// bogusOrderoloOrder(bogusBody)

// bogusOrderoloOrder(good)


// const printStuff = () => {

//   console.log(`oid is: ${oid}`)
  


// printStuff();

exports.sendTotals  = async (req, res) => {
console.log(req.body.email)
console.log(req.body.dailyTotal)
  const sendMailBasic = function (mailOptions2, transporter) {
    // console.log()
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
          console.log("email not sent");
          reject(error);
        } else {
          console.log("email sent");
          resolve(info);
          console.log(info);


          // res.send({ data });

        }
      });
    });
  };


  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "orders@mamnoonrestaurant.com",
      pass: "orders4mama",
    },
  });




function showToFixed(value) {
    let decvalue = value/100
    return decvalue.toFixed(2).replace('.00', '')
}



let htmlBody = `<h1>${process.env.LOCAL_ENVIRONMENT}Daily Report  - ${Date()}</h1><br><hr><h3>mamnoon street</h3><br>pretotal: $${showToFixed(req.body.dailyTotal.street.pretotal)} tips: $${showToFixed(req.body.dailyTotal.street.tips)} <hr><h3>mamnoon</h3><br>pretotal: $${showToFixed(req.body.dailyTotal.mamnoon.pretotal)} tips: $${showToFixed(req.body.dailyTotal.mamnoon.tips)} <hr>`



  try {
    var mailOptions = {
      from: "orders@mamnoonrestaurant.com",
      to: req.body.email,
      subject: `${process.env.LOCAL_ENVIRONMENT}Daily Report - ${Date()}`,
      html: htmlBody,
    };

    sendMailBasic(mailOptions, transporter);



  } catch (error) {
    console.log("error from catch oloOrder.js", error);
  }



}




// updateRefundAmount("c0ac7cefb5cb46b0bac320e2212de623-5576d63906014f0c88b4160da529a8c2",300);






