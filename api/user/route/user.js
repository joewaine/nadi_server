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

const auth = require("../../../config/auth");
const userController = require("../controller/userController");
router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.post("/addproduct", userController.addProduct);
router.get("/:id", userController.getUserProducts);
router.post("/deletetestimonial", userController.deleteTestimonial);
router.post("/usegiftcard", userController.useGiftCard);
router.post("/lookupgiftcard", userController.lookUpGiftCard);
router.get("/gettestimonials/:email", userController.getTestimonials);
router.post("/submittestimonial", userController.submitTestimonial);
router.get("/email/:email", userController.getUserInfo);
router.post("/submitgiftcard", userController.submitGiftcard);
router.post("/submitdeliveryaddress", userController.submitDeliveryAddress);
router.post("/submitbillingaddress", userController.submitBillingAddress);
router.post("/deletegiftcard", userController.deleteGiftcard);
router.get("/getgiftcards/:email", userController.getGiftcards);
router.post("/primarygiftcard", userController.primaryGiftCard);

module.exports = router;
