const express = require("express");
const router = express.Router();
const moment = require("moment");

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

const reservationController = require("../controller/reservationController");
const axios = require("axios");
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();

// router.post("/addreservation", reservationController.addReservation);
// router.get("/retrieve", reservationController.retrieve);

router.get("/dateoverlaplive", reservationController.dateOverlap);
// router.get("/dateoverlaplivemamnoon", reservationController.dateOverlapMamnoon);
router.get("/retrieve/:email", reservationController.retrieveByEmail);

router.get(
  "/retrievemamnoon/:email",
  reservationController.retrieveByEmailMamnoon
);

module.exports = router;
