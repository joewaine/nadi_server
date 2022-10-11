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

const orderController = require("../controller/orderController");
const axios = require("axios");
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();

//////testing ///////

///// orders /////
router.post("/oloorder", orderController.oloOrder);
router.post("/oloorderstreet", orderController.oloOrderStreet);

router.post("/partial-refund-true/:id", orderController.partialRefundTrue);
router.post("/tip-refund-true/:id", orderController.tipRefundTrue);


// router.post("/addorder", orderController.addOrder);
router.post("/addorder", orderController.lookUpOrderConfirmationCode);
// router.get('/allorders', orderController.getOrders);
// router.post('/:id', orderController.deleteOrder);
router.get("/email/:email", orderController.retrieveOrders);
router.get("/orderhistory", orderController.allOrders);
router.get("/todaysorderhistory", orderController.todaysOrderHistory);



router.get("/getemaildomains", orderController.getCustomerEmails)



router.get("/retrieveordersbydate/:date", orderController.retrieveByDate);





router.get("/retrievepreorders", orderController.retrievePreOrders);



router.post("/cancelpreorder/:id", orderController.cancelPreOrder);

router.get("/loadorderbyid/:id", orderController.loadOrderById);

router.post("/mark-as-shipped", orderController.markAsShipped);
router.get("/polling-request", orderController.pollingRequest);
router.post("/start-transaction", orderController.startTransaction);

router.post("/start-auth", orderController.startAuth);

router.post(
  "/start-transaction-retail",
  orderController.startTransactionRetail
);

router.get(
  "/acceptingOrdersBoolean/:restaurant",
  orderController.acceptingOrdersBoolean
);



router.get('/togglingOnlineOrders/:toggled', orderController.togglingOnlineOrders)
// router.get('/returnToggled', orderController.returnToggled)


// voiding
router.post("/issue-void", orderController.issueVoid);
router.post("/void-transid-mongo", orderController.voidByTransIDMongo);
// voiding
// issue return with Gravity
router.post("/issue-tokenized-return", orderController.tokenizedReturn);
// update mongo with return 
router.post("/update-refunded-items-mongo", orderController.updateRefundItemsMongo);

router.post("/usegiftcard", orderController.useGiftCard);
router.post("/lookupgiftcard", orderController.lookUpGiftCard);

router.post("/start-credit-save", orderController.startCreditSave);

router.post("/sendtotals", orderController.sendTotals);


// retrieveOrders
// .header("Access-Control-Allow-Origin", "*");

module.exports = router;
