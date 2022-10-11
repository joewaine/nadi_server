const Credit = require("../model/Credit");
const fetch = require("node-fetch");
const btoa = require("btoa");
const axios = require("axios");
const e = require("express");

var sdk = require("emergepay-sdk");
const { replaceWith } = require("cheerio/lib/api/manipulation");




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



exports.creditSaveMongo = async (req, res) => {
  try {
    const credit = new Credit({
      email: req.body.email,
      approvalData: req.body.approvalData,
      primary: false,
      maskedNumber: req.body.approvalData.maskedAccount,
    });

    let data = await credit.save();
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

// mongo call to get all credit cards associated with user email, also in
// https://www.nadimama.com/profile
exports.getCreditCards = async (req, res) => {
  try {
    const credit = await Credit.findByCreditEmail(req.params.email);
    //   console.log(credit)
    const usercreditcards = credit;
    res.status(201).json({ usercreditcards });
  } catch {
    res.status(400).json({ err: err });
  }
};

// when you save a card, it will check and see if the card has already been saved, this happen in the online order flow after the transaction

exports.checkCreditCard = async (req, res) => {
  try {
    console.log("check credit cards");
    // console.log(req.body)

    const credit = await Credit.find(
      {
        email: req.body.email,
        maskedNumber: req.body.approvalData.maskedAccount,
      },
      function (err, user) {
        if (err) {
          res.send(err);
        }
        console.log("from the find?");
        console.log(user);
        //    res.json(user);

        res.status(201).json({ user });
      }
    );
  } catch {
    res.status(400).json({ err: err });
  }
};

exports.getCreditAuth = async (req, res) => {

  console.log(req.body);
  let order = req.body.currentOrder;
  let amount = Number(order.charges.total) - Number(order.charges.tip.amount);
  let tipAmount = Number(order.charges.tip.amount);

  let toFixed = tipAmount / 100;

  let formattedTipAmount = toFixed.toFixed(2);

  let finalAmount = amount;
  let finalCash = finalAmount / 100;

  console.log('order.confirmation_code');
  console.log(order.confirmation_code);


  var config = {
    transactionType: sdk.TransactionType.CreditAuth,
    method: "modal",
    transactionReference: order.confirmation_code,
    fields: [
      {
        id: "base_amount",
        value: finalCash.toString(),
      },
      {
        id: "external_tran_id",
        value: emergepay.getExternalTransactionId(),
      },
      {
        id: "tip_amount",
        value: formattedTipAmount.toString(),
      },
      {
        id: "billing_name",
        value: order.billing.billing_name,
      },
      {
        id: "billing_address",
        value: order.billing.billing_address,
      },
      {
        id: "billing_postal_code",
        value: order.billing.billing_postal_code,
      },
    ],
  };
  emergepay
    .startTransaction(config)
    .then(function (transactionToken) {
      res.send({
        transactionToken: transactionToken
      });
      console.log(`transactionToken`, transactionToken);
    })
    .catch(function (err) {
      res.send(err.message);
    });
};

///

///

///

//run a tokenized transaction when the check is closed

// emergepay.forceTransaction({
//   uniqueTransId: "your_unique_trans_id",
//   externalTransactionId: emergepay.getExternalTransactionId(),
//   // Optional values
//   amount: "0.01",
//   tipAmount: "0.01",
//   cashierId: "",
//   transactionReference: "",
//   // Only applicable to level 2 transactions
//   taxAmount: ""
// })
// .then(function(response) {
//   var data = response.data;
// })
// .catch(function(error) {
//   throw error;
// });




///

//delete
exports.deleteCreditCard = async (req, res) => {
  const creditCardDelete = await Credit.findOneAndDelete(
    { _id: req.body.creditCardId },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted Card : ", docs);
      }
    }
  );

  res.status(201).json({ creditCardDelete });
};

// stops a card from being primary
exports.primaryCreditCardFalse = async (req, res) => {
  try {
    // let doc = await Order.findById('5f97465eebb3b9108bc2a50b')
    console.log(req.body.email);
    let doc = await Credit.updateMany(
      { email: req.body.email },
      {
        $set: {
          primary: false,
        },
      },
      function (err, doc) {}
    );
    console.log("primary giftcard updated");
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

// makes a card primary
exports.primaryCreditCardTrue = async (req, res) => {
  try {
    // let doc = await Order.findById('5f97465eebb3b9108bc2a50b')

    let doc = await Credit.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          primary: true,
        },
      },
      function (err, doc) {}
    );
    console.log("primary giftcard updated to true id");
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

//  might be used somewhere
let primaryCreditCardTrue = async (email) => {
  try {
    // let doc = await Order.findById('5f97465eebb3b9108bc2a50b')

    let doc = await Credit.findOneAndUpdate(
      { email: email },
      {
        $set: {
          primary: true,
        },
      },
      function (err, doc) {}
    );
    console.log("primary giftcard updated to true id");
    // res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

// if theres only one credit card, it will be set to primary
exports.setPrimaryIfOnlyOne = async (req, res) => {
  try {
    console.log("set primary if only one");
    console.log(req.body);
    const credit = await Credit.findByCreditEmail(req.body.email);
    console.log(credit);
    const usercreditcards = credit;
    res.status(201).json({ usercreditcards });

    if (credit.length === 1) {
      primaryCreditCardTrue(req.body.email);
    }
  } catch {
    res.status(400).json({ err: err });
  }
};

// normal tokenized transaction

exports.doTokenizedTransaction = async (req, res) => {
  let orderDivided = req.body.orderTotal / 100;
  let stringAmount = orderDivided.toFixed(2).toString();

  // let ext = '8d40092f-54a1-46ac-9300-0ada024f1573';
  // console.log(ext)
  // let un = '1d5b45fb356b4d0aac91761d7dce8d3c-b7339528a18f44338d3279c0542ae652';

  // Ensure that you supply a valid uniqueTransId before trying to run the tokenized payment.
  emergepay.tokenizedPaymentTransaction({
      uniqueTransId: req.body.transId,
      externalTransactionId: emergepay.getExternalTransactionId(),
      amount: stringAmount,
      // Optional
    })
    .then(function (response) {
      var data = response.data;

      res.send({ data });

      console.log(data);
    })
    .catch(function (error) {
      throw error;
    });
}
