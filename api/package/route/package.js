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

const packageController = require("../controller/packageController");
const axios = require("axios");
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();

router.post("/addpackage", packageController.addPackage);
router.post("/decrementpackage", packageController.decrementPackage);
router.post("/incrementpackage", packageController.incrementPackage);
router.post(
  "/decrementpackagebyupserveid",
  packageController.decrementPackageByUpserveId
);
router.post("/deletepackage", packageController.deletePackage);

// router.get("/decrementpackage/:id", packageController.decrementPackage);

router.get("/retrieve", packageController.retrieve);

router.get("/retrieveone/:upserveid", packageController.retrieveOne);



module.exports = router;
