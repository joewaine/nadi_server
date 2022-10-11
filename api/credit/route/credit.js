const express = require("express");
const router = express.Router();

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, X-Auth-Token, Accept"
  );
  //   next();

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});

const creditController = require("../controller/creditController");
const axios = require("axios");
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();


router.post('/start-credit-auth', creditController.getCreditAuth);
router.get("/getcreditcards/:email", creditController.getCreditCards);
router.post("/checkcreditcard/", creditController.checkCreditCard);
router.post("/creditsavemongo", creditController.creditSaveMongo);

router.post("/deletecreditcard", creditController.deleteCreditCard);
router.post("/primarycreditcardfalse", creditController.primaryCreditCardFalse);

router.post("/primarycreditcardtrue", creditController.primaryCreditCardTrue);

router.post("/tokenizedpayment", creditController.doTokenizedTransaction);
router.post("/setprimaryifonlyone", creditController.setPrimaryIfOnlyOne);
// retrieveCredits
// .header("Access-Control-Allow-Origin", "*");

module.exports = router;
