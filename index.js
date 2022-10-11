const compression = require("compression");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(compression());

app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());
var DomParser = require("dom-parser");
var parser = new DomParser();

const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const btoa = require("btoa");
const cron = require("node-cron");
require("dotenv").config();
const axios = require("axios");
const parseString = require("xml2js").parseString;
const qs = require("qs");
const mongoose = require("mongoose");
const config = require("./config/db");
var convert = require("xml-js");

const moment = require("moment");
const tz = require("moment-timezone");

const Order = require("./api/order/model/Order");
const Error = require("./api/error/model/Error");

const Package = require("./api/package/model/Package");

const Reservation = require("./api/reservation/model/Reservation");

// addPackage();

//useful functions that arent a focus are stored here now
// const f = require('./index2');

const pstOrdr = require("./api/order/helpers/postOrder");
const pstOrdrStr = require("./api/order/helpers/postOrderStreet");

const m = require("./mongoOrderHelpers");

const oloOrder = require("./api/order/helpers/oloOrder");

const nodemailer = require("nodemailer");

const Verifier = require("email-verifier");

let verifier = new Verifier("at_KGhUHzfRn75QZaF3gpqeKEqAIbIlY");

const {
  fNameAndConfirmCode,
  contactInfo,
  fullAddressAndName,
  sendVoidReturnCancelEmail,
  cancelConfirmCode,
  itemList,
  otherRestaurants,
} = require("./api/emails/emailTemplateHelpers");

app.get("/emailverified/:email", (req, res) => {
  // res.send(JSON.stringify({ Hello: "dont give up on me" }));
  console.log(req.params.email);

  verifier.verify(req.params.email, (err, data) => {
    if (err) throw err;
    res.send(JSON.stringify({ data }));
  });
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "orders@mamnoonrestaurant.com",
    pass: "orders4mama",
  },
});

const twilio = require("twilio");

const PNF = require("google-libphonenumber").PhoneNumberFormat;

const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();

// let client = new twilio('AC47c2d4df4e5ae7089fdd1e148308439e', 'f28ed5eef0ac3f7bcb23d40f071974e3');
let client = new twilio(
  process.env.TWILIO_FIRST_VAR,
  process.env.TWILIO_SECOND_VAR
);

// let feedbackParagraph = `<br><div style="background-color:#f05d5b;font-family: helvetica;padding: 10px;"><h1 style="color: #fff !important;font-size: 1.1rem;text-align: center;">How was your experience? Report bugs and suggest improvements <a style="color: #fff;" href="https://nadimama-feedback-zta0ansa.featureupvote.com/" target="_blank"><u>here</u></a>.</h1>
{
  /* <h2 style="color: #ffffff !important;font-size: 1.0rem;text-align: center;">Something else you'd like to tell us? Email <a style="color: #fff;" href="mailto:orders@mamnoonrestaurant.com" target="_blank"><u>here</u></a>.</h2></div>`; */
}

let feedbackParagraph = `<br><div style="background-color:#f05d5b;font-family: helvetica;padding: 10px;"> <h1 style="text-align: center;font-size: 1.3rem;margin-bottom: 0 !important;color: #ffffff;">How was your experience?</h1><table border="0" cellpadding="0" cellspacing="0" width="300" id="templateColumns" style="margin: 0 auto !important;"> <tr> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%98%A1"> 😡 </a> </td> </tr> </table> </td> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent">  <a style="font-size: 40px;text-decoration: none;text-align:center;" style="font-size: 40px;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%99%81">  🙁 </a> </td> </tr> </table> </td> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%98%90"> 😐 </a> </td> </tr> </table> </td> 
<td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent" tdalign="center"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%99%82"> 😊 </a> </td> </tr> </table> </td> 
<td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%98%8D"> 😍 </a> </td> </tr> </table> </td> </tr> </table> </div>`;

var sdk = require("emergepay-sdk");

const { createProxyMiddleware } = require("http-proxy-middleware");

let shippo = require("shippo")(process.env.SHIPPO_AUTH);

// let shippo = require('shippo')('shippo_test_269049c928caf592075ece7cfc698e8cddeff9d5');

//configure database and mongoose
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
// .connect(config.database, { useNewUrlParser: true })
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    // console.log("Database is connected");
  })
  .catch((err) => {
    // console.log({ database_error: err });
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("dev")); // configure morgan

app.get("/", (req, res) => {
  res.send(JSON.stringify({ Hello: "dont give up on me" }));
});

const userRoutes = require("./api/user/route/user"); //bring in our user routes
app.use("/user", userRoutes);

const productRoutes = require("./api/product/route/product"); //bring in our product routes
app.use("/product", productRoutes);

const orderRoutes = require("./api/order/route/order"); //bring in our order routes
app.use("/order", orderRoutes);

const creditRoutes = require("./api/credit/route/credit"); //bring in our credit routes
app.use("/credit", creditRoutes);

// const tockRoutes = require("./api/tock/route/tock"); //bring in our tock routes
const e = require("express");

// app.use("/tock", tockRoutes);

const packageRoutes = require("./api/package/route/package"); //bring in our package routes
app.use("/package", packageRoutes);

const reservationRoutes = require("./api/reservation/route/reservation"); //bring in our reservation routes
app.use("/reservation", reservationRoutes);

//sandbox

// var oid = process.env.GRAVITY_SANDBOX_OID;
// var authToken = process.env.GRAVITY_SANDBOX_AUTH_TOKEN;
// var environmentUrl = process.env.GRAVITY_SANDBOX_ENVIRONMENT_URL;

// production
var oid = process.env.GRAVITY_PROD_OID;
var authToken = process.env.GRAVITY_PROD_AUTH_TOKEN;
var environmentUrl = process.env.GRAVITY_PROD_ENVIRONMENT_URL;

var emergepay = new sdk.emergepaySdk({
  oid: oid,
  authToken: authToken,
  environmentUrl: environmentUrl,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//The client side can hit this endpoint by issuing a POST request to

app.listen(PORT, () => {
  // console.log(typeof(PORT));

  console.log(`App is running on ${PORT}`);
});

app.post("/sendbugstate", function (req, res) {
  console.log(req.body);
  var mailOptions = {
    from: "orders@mamnoonrestaurant.com",
    to: "joe.waine@gmail.com",
    subject: `${process.env.LOCAL_ENVIRONMENT}new bug`,
    html: JSON.stringify(req.body),
  };
  const sendMailBug = function (mailOptions2, transporter) {
    console.log();
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
          reject(error);
        } else {
          res.send("email sent");
          console.log("email sent");
          resolve(info);
        }
      });
    });
  };
  sendMailBug(mailOptions, transporter);
});

// ####################################################################################################
// ############# EMAIL FUNCTIONS BELOW ################################################################
// ####################################################################################################

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
      }
    });
  });
};

app.post("/confirmationemail", function (req, res) {
  console.log(req.body);

  console.log("localEmail");
  console.log("localEmail");
  console.log("localEmail");
  console.log("localEmail");

  res.send(req.body);

  let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}`;

  if (req.body.fulfillment_info.type === "delivery") {
    htmlBody = htmlBody + `Your Order Has Been Scheduled!</h1></div>`;
  } else {
    htmlBody = htmlBody + `Your Order Has Been Scheduled!</h1></div>`;
  }

  htmlBody =
    htmlBody +
    `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Thanks for your order!<br>name: ${req.body.fulfillment_info.customer.first_name.replace(
      "nx ",
      ""
    )}<br>
        <br><span style="font-size: 20px !important;">confirmation code: <b>${
          req.body.confirmation_code
        }</b></span><br/><br/>It will be ready on ${moment(
      String(req.body.scheduled_time)
    )
      .tz("America/Los_Angeles")
      .format("llll")
      .replace(
        ", 2020",
        ", at"
      )}</p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;">`;

  htmlBody = htmlBody + itemList(req.body);

  let addressToInsert = "";

  if (req.body.restaurant === "Mamnoon Street") {
    addressToInsert = "2020 6th Ave, Seattle, WA 98121";
    phoneNumber =
      '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
  }

  if (req.body.restaurant === "Mamnoon") {
    addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
    phoneNumber =
      '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
  }

  htmlBody =
    htmlBody +
    `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at ${req.body.restaurant}<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

  let dyn = `${process.env.LOCAL_ENVIRONMENT}Your Order Has Been Scheduled! We will notify you when your food is being prepared.`;

  // String(process.env.LOCAL_ENVIRONMENT)

  htmlBody = htmlBody + feedbackParagraph + otherRestaurants();
  var mailOptions = {
    from: "orders@mamnoonrestaurant.com",
    to: req.body.fulfillment_info.customer.email,
    bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
    subject: dyn,
    html: htmlBody,
  };
  sendMailBasic(mailOptions, transporter);

  const number = phoneUtil.parseAndKeepRawInput(
    req.body.fulfillment_info.customer.phone,
    "US"
  );
  let smsNumber = phoneUtil.format(number, PNF.E164);
  if (req.body.sms === true) {
    client.messages.create({
      to: smsNumber,
      from: "+12062087871",
      body: `Your Order Has Been Scheduled! it will be ready on ${moment(
        String(req.body.scheduled_time)
      )
        .tz("America/Los_Angeles")
        .format("llll")
        .replace(", 2020", ", at")}`,
    });
  }
});

// ####################################################################################################

async function sendAcceptanceEmail(upserveId) {
  try {
    let doc = await Order.find({
      upserveId: upserveId,
      acceptanceEmailSent: false,
    });

    let htmlBody = `<div style="background-color: #000099;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}`;

    if (doc[0].orderInfo.fulfillment_info.type === "delivery") {
      htmlBody = htmlBody + `Your Order Has Been Accepted.</h1></div>`;
    } else {
      htmlBody = htmlBody + `Your Order Has Been Accepted.</h1></div>`;
    }

    htmlBody =
      htmlBody +
      `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Your ticket has been opened and your food is being prepared.<br>name: ${doc[0].orderInfo.fulfillment_info.customer.first_name.replace(
        "nx ",
        ""
      )}<br>
    <br><span style="font-size: 20px !important;">confirmation code: <b>${
      doc[0].orderInfo.confirmation_code
    }</b></span><br/><br/></p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;"">`;
    // for (let i = 0; i < doc[0].orderInfo.charges.items.length; i++) {
    //   htmlBody =
    //     htmlBody +
    //     '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
    //     JSON.stringify(doc[0].orderInfo.charges.items[i].name) +
    //     "&nbsp;<b>$" +
    //     JSON.stringify(doc[0].orderInfo.charges.items[i].price) / 100 +
    //     "</b>&nbsp;x&nbsp;" +
    //     JSON.stringify(doc[0].orderInfo.charges.items[i].quantity) +
    //     "</li>";
    // }

    htmlBody = htmlBody + itemList(doc[0].orderInfo);

    let addressToInsert = "";
    let phoneNumber = "";
    if (doc[0].orderInfo.restaurant === "Mamnoon Street") {
      addressToInsert = "2020 6th Ave, Seattle, WA 98121";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
    }

    if (doc[0].orderInfo.restaurant === "Mamnoon") {
      addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
    }

    htmlBody =
      htmlBody +
      `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at ${doc[0].orderInfo.restaurant}<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

    htmlBody = htmlBody + feedbackParagraph;

    var mailOptions = {
      from: "orders@mamnoonrestaurant.com",
      to: doc[0].orderInfo.fulfillment_info.customer.email,
      bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
      subject: `${process.env.LOCAL_ENVIRONMENT}Your order has been accepted.`,
      html: htmlBody,
    };

    const sendMail = function (mailOptions2, transporter) {
      // console.log()
      return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions2, function (error, info) {
          if (error) {
            reject(error);
          } else {
            // console.log('email sent')

            m.acceptanceEmailSentTrue(upserveId);

            resolve(info);
          }
        });
      });
    };

    sendMail(mailOptions, transporter);

    const number = phoneUtil.parseAndKeepRawInput(
      doc[0].orderInfo.fulfillment_info.customer.phone,
      "US"
    );
    let smsNumber = phoneUtil.format(number, PNF.E164);

    // console.log('order accepted food now prepared')
    if (doc[0].orderInfo.sms === true) {
      client.messages.create({
        to: smsNumber,
        from: "+12062087871",
        body: `Your order has been accepted and is now being prepared.`,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// ####################################################################################################

async function sendUnableToProcessEmail(upserveId) {
  try {
    let doc = await Order.find({
      upserveId: upserveId,
      acceptanceEmailSent: false,
    });

    let htmlBody = `<div style="background-color: #000099;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}`;

    if (doc[0].orderInfo.fulfillment_info.type === "delivery") {
      htmlBody =
        htmlBody +
        `We were unable to process your payment. Please check your payment method and try placing your order again.</h1></div>`;
    } else {
      htmlBody =
        htmlBody +
        `We were unable to process your payment. Please check your payment method and try placing your order again.</h1></div>`;
    }

    htmlBody =
      htmlBody +
      `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>We were unable to process your payment.<br>name: ${doc[0].orderInfo.fulfillment_info.customer.first_name.replace(
        "nx ",
        ""
      )}<br>
      <br><span style="font-size: 20px !important;">confirmation code: <b>${
        doc[0].orderInfo.confirmation_code
      }</b></span><br/><br/></p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;"">`;
    // for (let i = 0; i < doc[0].orderInfo.charges.items.length; i++) {
    //   htmlBody =
    //     htmlBody +
    //     '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
    //     JSON.stringify(doc[0].orderInfo.charges.items[i].name) +
    //     "&nbsp;<b>$" +
    //     JSON.stringify(doc[0].orderInfo.charges.items[i].price) / 100 +
    //     "</b>&nbsp;x&nbsp;" +
    //     JSON.stringify(doc[0].orderInfo.charges.items[i].quantity) +
    //     "</li>";
    // }

    htmlBody = htmlBody + itemList(doc[0].orderInfo);

    let addressToInsert = "";
    let phoneNumber = "";
    if (doc[0].orderInfo.restaurant === "Mamnoon Street") {
      addressToInsert = "2020 6th Ave, Seattle, WA 98121";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
    }

    if (doc[0].orderInfo.restaurant === "Mamnoon") {
      addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
    }

    htmlBody =
      htmlBody +
      `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at ${doc[0].orderInfo.restaurant}<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

    htmlBody = htmlBody + feedbackParagraph;

    var mailOptions = {
      from: "orders@mamnoonrestaurant.com",
      to: doc[0].orderInfo.fulfillment_info.customer.email,
      bcc: "joe@mamnoonrestaurant.com",
      subject: `${process.env.LOCAL_ENVIRONMENT}We were unable to process your payment.`,
      html: htmlBody,
    };
    const sendMail = function (mailOptions2, transporter) {
      return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions2, function (error, info) {
          if (error) {
            reject(error);
          } else {
            m.acceptanceEmailSentTrue(upserveId);
            resolve(info);
          }
        });
      });
    };

    sendMail(mailOptions, transporter);

    const number = phoneUtil.parseAndKeepRawInput(
      doc[0].orderInfo.fulfillment_info.customer.phone,
      "US"
    );
    let smsNumber = phoneUtil.format(number, PNF.E164);
    if (doc[0].orderInfo.sms === true) {
      client.messages.create({
        to: smsNumber,
        from: "+12062087871",
        body: `Your order has been accepted and is now being prepared.`,
      });
    }
  } catch (err) {}
}

// ####################################################################################################

async function sendReadyEmail(upserveId) {
  try {
    let doc = await Order.find({ upserveId: upserveId });
    let htmlBody = `<div style="background-color: #009900;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}`;

    htmlBody =
      htmlBody +
      `Your ${doc[0].orderInfo.restaurant} Order Is Ready!</h1></div>`;

    htmlBody =
      htmlBody +
      `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Thanks for your order!<br>customer name: ${doc[0].orderInfo.fulfillment_info.customer.first_name.replace(
        "nx ",
        ""
      )}<br>
    <br><span style="font-size: 20px !important;">confirmation code: <b>${
      doc[0].orderInfo.confirmation_code
    }</b></span><br/><br/></p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;"">`;
    // for (let i = 0; i < doc[0].orderInfo.charges.items.length; i++) {
    //   htmlBody =
    //     htmlBody +
    //     '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
    //     JSON.stringify(doc[0].orderInfo.charges.items[i].name) +
    //     "&nbsp;<b>$" +
    //     JSON.stringify(doc[0].orderInfo.charges.items[i].price) / 100 +
    //     "</b>&nbsp;x&nbsp;" +
    //     JSON.stringify(doc[0].orderInfo.charges.items[i].quantity) +
    //     "</li>";
    // }

    htmlBody = htmlBody + itemList(doc[0].orderInfo);

    let addressToInsert = "";
    let phoneNumber = "";

    if (doc[0].orderInfo.restaurant === "Mamnoon Street") {
      addressToInsert = "2020 6th Ave, Seattle, WA 98121";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
    }

    if (doc[0].orderInfo.restaurant === "Mamnoon") {
      addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
    }

    htmlBody =
      htmlBody +
      `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at ${doc[0].orderInfo.restaurant}<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

    htmlBody = htmlBody + feedbackParagraph;

    var mailOptions = {
      from: "orders@mamnoonrestaurant.com",
      to: doc[0].orderInfo.fulfillment_info.customer.email,
      bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
      subject: `${process.env.LOCAL_ENVIRONMENT}Your ${doc[0].orderInfo.restaurant} Order Is Ready!`,
      html: htmlBody,
    };
    const sendMail = function (mailOptions2, transporter) {
      return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions2, function (error, info) {
          if (error) {
            reject(error);
          } else {
            readyEmailSentTrue(upserveId);
            m.updateToStatusClosed(upserveId);
            resolve(info);
          }
        });
      });
    };

    sendMail(mailOptions, transporter);

    const number = phoneUtil.parseAndKeepRawInput(
      doc[0].orderInfo.fulfillment_info.customer.phone,
      "US"
    );
    let smsNumber = phoneUtil.format(number, PNF.E164);
    if (doc[0].orderInfo.sms === true) {
      client.messages.create({
        to: smsNumber,
        from: "+12062087871",
        body: `Your ${doc[0].orderInfo.restaurant} Pickup Order Is Ready!`,
      });
    }
  } catch (err) {}
}

// ######################################################################################################################################################
// ############## END EMAIL FUNCTIONS ###################################################################################################################
// ######################################################################################################################################################

async function updateToStatusAccepted(idToAccept) {
  try {
    const doc = await Order.updateOne(
      { upserveId: idToAccept, orderAccepted: false },
      // { $set: { orderAccepted: true, orderPosted: true } },
      { $set: { orderAccepted: true } },
      { multi: true },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          if (idToAccept) {
            sendAcceptanceEmail(idToAccept);
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

// query orders:
// looks up from a list of closed orders
async function queryAndCloseOrders(closedOrders) {
  // console.log("query AND CLOSE orders");
  try {
    let docs = await Order.find({
      upserveId: { $in: closedOrders },
      status: "Open",
      readyEmailSent: false,
    });

    // console.log(docs);

    if (docs.length > 0) {
      for (let i = 0; i < docs.length; i++) {
        // console.log('sendRedyEmail')
        // sendReadyEmail(docs[i].upserveId);

        console.log(docs[i]);

        if (process.env.LOCAL_ENVIRONMENT === "") {
          // setStatusCLosed"
          setClosedTimeStamp(docs[i].upserveId);

          doTokenizedTransaction(
            docs[i].payInfo.uniqueTransId,
            docs[i].orderInfo.charges.total,
            docs[i]
          );
        } else {
          console.log("is local, so nothing processed");
          console.log("is local, so nothing processed");
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function setClosedTimeStamp(upserveIdNumber) {
  try {
    const doc = await Order.updateOne(
      { upserveId: upserveIdNumber },
      { $set: { timeClosed: Date.now(), orderPosted: true, status: "Closed" } },
      { multi: true },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("timestamp added");
          console.log("timestamp added");
          console.log("timestamp added");
          console.log("timestamp added");
          console.log("timestamp added");
          console.log(Date.now());
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function doTokenizedTransaction(transId, amountProcessed, docs) {
  console.log("transid");
  console.log(transId);

  console.log("amountProcessed");
  console.log(amountProcessed);

  console.log("do tokenized transaction");

  console.log(docs.orderInfo.restaurant);

  let orderDivided = amountProcessed / 100;
  let stringAmount = orderDivided.toFixed(2).toString();
  emergepay
    .tokenizedPaymentTransaction({
      uniqueTransId: transId,
      externalTransactionId: emergepay.getExternalTransactionId(),
      amount: stringAmount,
      transactionReference:
        docs.orderInfo.restaurant +
        " Upserve " +
        docs.orderInfo.confirmation_code,
      // Optional
    })
    .then(function (response) {
      var data = response.data;

      if (data.resultMessage === "Approved") {
        console.log("tokenized transaction successful.");
        // send an email saying payment was acceoted

        readyEmailSentTrue(docs.upserveId);
        m.updateToStatusClosed(docs.upserveId);
      } else {
        console.log("tokenized transaction NOT successful.");
        sendUnableToProcessEmail(docs.upserveId);
      }
    })
    .catch(function (error) {
      console.log("not found");
    });
}

// look up not accepted orders, attempt to run preauthorized transaction,
// // if transaction is successful, set order to accepted in the database and send acceptance email
// // if not, send an insufficient funds email.
async function queryOrdersToAccept(ordersToAccept, restaurant) {
  // console.log('ordersToAccept');
  console.log(restaurant, ordersToAccept);
  for (var acceptee in ordersToAccept) {
    Order.findOne(
      {
        upserveId: ordersToAccept[acceptee],
        status: "Open",
        orderAccepted: false,
      },
      (err, order) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (order !== null) {
            console.log("here is an unaccepted order:");
            // attemptToRunChargeAndAccept(order);
            // console.log(order)
            updateToStatusAccepted(order.upserveId);
          }
        }
      }
    );
    // }
  }
}

// ####################################################################################################
// ############# STATUS FUNCTIONS BELOW ###############################################################
// ####################################################################################################

async function checkCheckStatus() {
  let order = moment().tz("America/Los_Angeles").format("YYYYMMDD");

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/checks.json?date=${order}`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-llc`,
          "X-Breadcrumb-Password": "sbkh_Qgs4HMB",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();

      let closedOnlineOrders = body.objects
        .filter(function (x) {
          return x.hasOwnProperty("online_order");
        })
        .filter(function (x) {
          return x.online_order.source === "Generic Online Ordering";
        })
        .filter(function (x) {
          return x.status === "Closed";
        })
        .map(function (x) {
          return x.online_order.id;
        });

      //not accepted orders
      let notAcceptedOrders = body.objects
        .filter(function (x) {
          return x.hasOwnProperty("online_order");
        })
        .filter(function (x) {
          return x.online_order.source === "Generic Online Ordering";
        })
        .filter(function (x) {
          return !x.hasOwnProperty("employee_name");
        })
        .filter(function (x) {
          return !x.hasOwnProperty("employee_role_name");
        })
        .filter(function (x) {
          return !x.hasOwnProperty("employee_id");
        })
        .filter(function (x) {
          return x.status === "Open";
        })
        .map(function (x) {
          return x.online_order.id;
        });
      //accepted orders
      let acceptedOrders = body.objects
        .filter(function (x) {
          return x.hasOwnProperty("online_order");
        })
        .filter(function (x) {
          return x.online_order.source === "Generic Online Ordering";
        })
        .filter(function (x) {
          return x.hasOwnProperty("employee_role_name");
        })
        .filter(function (x) {
          return x.hasOwnProperty("employee_id");
        })
        .filter(function (x) {
          return x.status === "Open";
        })
        .map(function (x) {
          return x.online_order.id;
        });
      //open orders
      let openOrders = body.objects
        .filter(function (x) {
          return x.hasOwnProperty("online_order");
        })
        .filter(function (x) {
          return x.status === "Open";
        })
        .map(function (x) {
          return x.online_order.id;
        });

      // console.log("openOrders");
      // console.log(openOrders);

      queryAndCloseOrders(closedOnlineOrders);
      queryOrdersToAccept(acceptedOrders, "mamnoon");
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
}

// ####################################################################################################

async function checkCheckStatusStreet() {
  // checks all of the checks
  let order = moment().tz("America/Los_Angeles").format("YYYYMMDD");
  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/checks.json?date=${order}`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-street`,
          "X-Breadcrumb-Password": "H227s3CADgg4",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();
      // closed online orders

      // //not accepted orders
      let closedOnlineOrders = body.objects
        .filter(function (x) {
          return x.hasOwnProperty("online_order");
        })
        .filter(function (x) {
          return x.online_order.source === "Generic Online Ordering";
        })
        .filter(function (x) {
          return x.status === "Closed";
        })
        .map(function (x) {
          return x.online_order.id;
        });
      //not accepted orders
      let notAcceptedOrders = body.objects
        .filter(function (x) {
          return x.hasOwnProperty("online_order");
        })
        .filter(function (x) {
          return x.online_order.source === "Generic Online Ordering";
        })
        .filter(function (x) {
          return !x.hasOwnProperty("employee_name");
        })
        .filter(function (x) {
          return !x.hasOwnProperty("employee_role_name");
        })
        .filter(function (x) {
          return !x.hasOwnProperty("employee_id");
        })
        .filter(function (x) {
          return x.status === "Open";
        })
        .map(function (x) {
          return x.online_order.id;
        });

      //accepted orders
      let acceptedOrders = body.objects
        .filter(function (x) {
          return x.hasOwnProperty("online_order");
        })
        .filter(function (x) {
          return x.online_order.source === "Generic Online Ordering";
        })
        .filter(function (x) {
          return x.hasOwnProperty("employee_role_name");
        })
        .filter(function (x) {
          return x.hasOwnProperty("employee_id");
        })
        .filter(function (x) {
          return x.status === "Open";
        })
        .map(function (x) {
          return x.online_order.id;
        });
      //  query orders to close
      queryAndCloseOrders(closedOnlineOrders);
      queryOrdersToAccept(acceptedOrders, "street");
    }
  } catch (err) {
    console.log(err);
  }
}

// ####################################################################################################
// ############# END STATUS FUNCTIONS #################################################################
// ####################################################################################################

// ####################################################################################################

// ####################################################################################################
// ############# ORDER FUNCTIONS BELOW ################################################################
// ####################################################################################################

//mongohelper
async function placeScheduledOrders() {
  let today = new Date();

  try {
    let docs = await Order.find({
      "orderInfo.preorder": true,
      orderPosted: false,
      cancelled: false,
    });

    let outcome = docs.map(function (x) {
      return {
        id: x.orderInfo.id,
        preorder: x.orderInfo.preorder,
        scheduled_time: x.orderInfo.scheduled_time,
      };
    });

    for (let i = 0; i < outcome.length; i++) {
      let date = new Date(outcome[i].scheduled_time); // some mock date
      let milliseconds = date.getTime();

      // use this
      let arrival = milliseconds - Date.now() - 1740000;
      if (arrival < 0) {
        if (docs[i].orderPosted === false) {
          if (docs[i].orderInfo.restaurant === "Mamnoon") {
            oloOrderFromIndex(docs[i]);
          } else {
            oloOrderStreetFromIndex(docs[i]);
          }
        }
      } else {
      }
    }
  } catch (err) {
    console.log(err);
  }
}

oloOrderFromIndex = async (req) => {
  console.log("req come in and try");
  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req.orderInfo, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
        "X-Breadcrumb-Password": "uQM8mseTvnTX",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;
      console.log("in here then then");
      console.log(response.data);
      console.log("post order");
      pstOrdr.postScheduledOrder(req.orderInfo);
      orderPostedTrue(req.upserveId);
      logUpserveResponse(req.orderInfo, response.data, true);

      /// .catch(soething)
    })
    .catch(function (error) {
      console.log(typeof error.response);

      console.log("error.response:");
      console.log(error.response);
      console.log("in catch  then then");
      sendOrderError(req.orderInfo, error, false);
      orderPostedTrue(req.upserveId);
    });
};

oloOrderStreetFromIndex = async (req) => {
  console.log("req come in and try");
  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req.orderInfo, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
        "X-Breadcrumb-Password": "TJzwaP8uguyy",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;
      console.log("in here then then");
      console.log(response.data);
      console.log("post order");
      pstOrdr.postScheduledOrder(req.orderInfo);
      orderPostedTrue(req.upserveId);
      logUpserveResponse(req.orderInfo, response.data, true);

      /// .catch(soething)
    })
    .catch(function (error) {
      console.log(typeof error.response);

      console.log("error.response:");
      console.log(error.response);
      console.log("in catch  then then");
      sendOrderError(req.orderInfo, error, false);
      orderPostedTrue(req.upserveId);
    });
};

async function orderPostedTrue(idToClose) {
  // console.log('do order posted true')
  try {
    await Order.updateOne(
      { upserveId: idToClose },
      { $set: { orderPosted: true } },
      { multi: true }
    );
  } catch (err) {
    // console.log(err)
  }
}

// async function lookUpScheduledOrders() {
//   console.log('scheduled orders')
//   console.log('scheduled orders')
//   console.log('scheduled orders')
//   try {
//     let docs = await Order.find({
//       "orderInfo.preorder": true,
//       orderPosted: false,
//     });

//     let outcome = docs.map(function (x) {
//       return {
//         id: x.orderInfo.id,
//         preorder: x.orderInfo.preorder,
//         scheduled_time: x.orderInfo.scheduled_time,
//       };
//     });
//     console.log(outcome);

//   } catch (err) {
//       console.log(err)
//   }
// }

cron.schedule("*/10 * * * * *", () => {
  // if(process.env.LOCAL_ENVIRONMENT === ''){
  checkCheckStatus();
  checkCheckStatusStreet();
  placeScheduledOrders();

  // showClosedPreOrders();

  // }

  if (process.env.LOCAL_ENVIRONMENT === "") {
    console.log("not local");
  } else {
    console.log("local");
  }
});

cron.schedule("* * 16 * * *", () => {
  // dailyReport();
});

async function dailyReport() {
  console.log("dailyReport()");
}

// ####################################################################################################
// ############# END ORDERS FUNCTIONS #################################################################
// ####################################################################################################

let reservations;

async function sevenRoomsMbar(date) {
  try {
    let request = await fetch(
      `https://api.sevenrooms.com/2_4/reservations/export?venue_group_id=ahNzfnNldmVucm9vbXMtc2VjdXJlciELEhRuaWdodGxvb3BfVmVudWVHcm91cBiAgPC5uamvCAw&limit=400&from_date=${date}&to_date=${date}&venue_id=ahNzfnNldmVucm9vbXMtc2VjdXJlchwLEg9uaWdodGxvb3BfVmVudWUYgIDwuezGlwoM`,
      {
        headers: {
          // 'Authorization': `6e1e4fbc8f8ae60d6dd6c880ba793114250e8f5ac4f4644d1924afab217792a1affe30ec2e31b389e9dbbfcc8a88ec8518d497cdca3700004b161d39a84b7feb`
          Authorization: sevenRoomsToken,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();

      reservations = body.data.results
        .map(function (x) {
          let lc = x.last_name;

          // console.log(x)
          //             // let map = x.map(function(x){
          //             //   return {
          //             //     net: x.total_net_payment,
          //             //     // rating: x.rating,
          //             //     last: x.last_name,
          //             //     ext: x.external_user_id
          //             //   }
          //             // })

          if (x.last_name !== null) {
            return {
              sevenrooms: lc.toLowerCase(),
              roomsinfo: {
                phone: x.phone_number,
                last: x.last_name,
                allInfo: x,
              },
            };
          }
        })
        .filter((x) => x !== undefined);

      checkCheckStatusMbar(date, reservations);
    }
  } catch (err) {
    console.log(err);
  }
}

app.get("/part2", async function (req, res) {
  let date = req.body.date;
  let reservationsList = req.body.reservations;

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/checks.json?date=${date}`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mbar`,
          "X-Breadcrumb-Password": "1Sovjopb9tZU",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();

      creditCards = body.objects
        .map(function (x) {
          return x.payments;
        })
        .filter((x) => x !== undefined)
        .flat()
        .map(function (x) {
          var n;
          if (x.cc_name !== null) {
            let j = x.cc_name;
            n = j.split(" ");
            return {
              upserve: n[n.length - 1].toLowerCase(),
            };
          }
        })
        .filter((x) => x !== undefined);

      let emparr = [];

      for (i in body.objects) {
        for (j in body.objects[i].payments) {
          let upserveInfo = body.objects[i].payments[j];
          upserveInfo.items = body.objects[i].items;
          emparr.push({
            upserveInfo,
            items: body.objects[i].items.map(function (x) {
              return x.name;
            }),
          });
        }
      }

      let builtArr = [];

      for (i in reservationsList) {
        for (j in emparr) {
          if (emparr[j].upserveInfo.cc_name !== null) {
            let n = emparr[j].upserveInfo.cc_name.split(" ");
            if (
              n[n.length - 1].toLowerCase() === reservationsList[i].sevenrooms
            ) {
              builtArr.push({
                email: reservationsList[i].roomsinfo.allInfo.email,
                date: reservationsList[i].roomsinfo.allInfo.date,
                reservationsList: reservationsList[i],
                upserveInfo: emparr[j],
              });
            }
          }
        }
      }

      // return builtArr
      res.send(builtArr);
    }
  } catch (err) {
    console.log(err);
  }
});

async function importMenus() {
  try {
    let request = await fetch(`http://imenupro.com/!hcd-9k`);
    // let request = await fetch(`https://s3.amazonaws.com/menupro/imp_Dw9asgjBm5LwFB/hcd-9k.js?v=626149246`)

    if (request.ok) {
      console.log(request);
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
}

//// importMenus();

async function mamnoonItemsPullMenu() {
  try {
    const request = await fetch(
      "https://hq.breadcrumb.com/ws/v1/menus/online_ordering/",
      {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
          "X-Breadcrumb-Password": "uQM8mseTvnTX",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      }
    );
    if (request.ok) {
      const body = await request.json();
      // upserveMongo('mamnoon')
    }
  } catch (err) {
    console.log("error");
  }
}
mamnoonItemsPullMenu();

const bogusEmail = async () => {
  console.log("bogus email");
  console.log("bogus email");
  console.log("bogus email");
  console.log("bogus email");
  console.log("bogus email");

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

  let feedbackParagraph = `<br><div style="background-color:#f05d5b;font-family: helvetica;padding: 10px;"> <h1 style="text-align: center;font-size: 1.3rem;margin-bottom: 0 !important;color: #ffffff;">How was your experience?</h1><table border="0" cellpadding="0" cellspacing="0" width="300" id="templateColumns" style="margin: 0 auto !important;"> <tr> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%98%A1"> 😡 </a> </td> </tr> </table> </td> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent">  <a style="font-size: 40px;text-decoration: none;text-align:center;" style="font-size: 40px;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%99%81">  🙁 </a> </td> </tr> </table> </td> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%98%90"> 😐 </a> </td> </tr> </table> </td> 
    <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent" tdalign="center"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%99%82"> 😊 </a> </td> </tr> </table> </td> 
    <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%98%8D"> 😍 </a> </td> </tr> </table> </td> </tr> </table> </div>`;

  try {
    let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}`;

    htmlBody = htmlBody + feedbackParagraph + otherRestaurants();
    var mailOptions = {
      from: "orders@mamnoonrestaurant.com",
      to: "joe.waine@gmail.com",
      bcc: "joe@mamnoonrestaurant.com",
      // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
      subject: `${process.env.LOCAL_ENVIRONMENT}Daily Report`,
      html: htmlBody,
    };

    sendMailBasic(mailOptions, transporter);

    console.log("sendMailBasic was hit above this clo");
  } catch (error) {
    console.log("error from catch oloOrder.js", error);
  }
};

// bogusEmail();

// async function findScheduledOrders() {
//   try {
//     let docs = await Order.find({
//       "orderInfo.preorder": true,
//       orderPosted: false,
//       cancelled: false
//     });

// console.log(docs.length);

//   } catch (err) {
//     console.log(err);
//   }
// }
// findScheduledOrders();

async function readyEmailSentTrue(idToClose) {
  try {
    await Order.updateOne(
      { upserveId: idToClose },
      { $set: { readyEmailSent: true } },
      { multi: true }
    );
  } catch (err) {
    // console.log(err)
  }
}

// async function acceptedTrue(idToAccept) {
//   try {
//     const doc = await Order.updateOne(
//       { upserveId: idToAccept, orderAccepted: false },
//       // { $set: { orderAccepted: true, orderPosted: true } },
//       { $set: { orderAccepted: true } },
//       { multi: true },
//       function (err, docs) {
//         if (err) {
//           console.log(err);
//         } else {
//           // if (idToAccept) {
//           //   sendAcceptanceEmail(idToAccept);
//           // }
//           console.log('accepted');
//         }
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// }

let logUpserveResponse = async (orderInfo, errorInfo, successFail) => {
  console.log(orderInfo);
  console.log(errorInfo);
  console.log(successFail);

  console.log("logUpserveResponse");
  // let errorSwitch = false;
  try {
    const error = new Error({
      orderInfo,
      errorInfo,
      successFail,
    });

    await error.save();
  } catch (err) {
    console.log(err);
    // res.status(400).json({ err: err });
    console.log("logUpserveResponse error");
    console.log("error");
  }
};

let sendOrderError = async (orderInfo, errorInfo, successFail) => {
  console.log("entering sendOrderError function");
  // let errorSwitch = false;
  try {
    const error = new Error({
      orderInfo,
      errorInfo,
      successFail,
    });

    await error.save();

    axios
      .get("https://mamnoontogo.net/wp-json/acf/v3/global/697")
      .then((res) => {
        let errorRecipients = res.data.acf["error message recipients"];
        console.log(errorRecipients);
        let emails = errorRecipients.map(function (x) {
          return x.email;
        });

        let phoneNumbers = errorRecipients.map(function (x) {
          let numberPhone = phoneUtil.parseAndKeepRawInput(
            x.phone_number,
            "US"
          );
          let smsNumber = phoneUtil.format(numberPhone, PNF.E164);
          return smsNumber;
        });

        // send email logic:

        let titleInfo =
          "<h2>posting error:&nbsp;" +
          orderInfo.billing.billing_name.replace("nx", "") +
          `</h2><br><p><h1>please enter this order for ${moment(
            orderInfo.fulfillment_info.estimated_fulfillment_time
          )
            .tz("America/Los_Angeles")
            .format("LT")}</h1>`;

        var mailOptions = {
          from: "orders@mamnoonrestaurant.com",
          to: emails.join(", "),
          subject: `upserve error ${orderInfo.billing.billing_name.replace(
            "nx",
            ""
          )}`,
          html:
            titleInfo +
            "<br>" +
            itemList(orderInfo) +
            "<br>error info:<br><pre>" +
            JSON.stringify(orderInfo) +
            JSON.stringify(errorInfo) +
            "</pre>",
        };
        const sendError = function (mailOptions2, transporter) {
          console.log();
          return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions2, function (error, info) {
              if (error) {
                reject(error);
                errorSwitch = true;
              } else {
                res.send("email sent");
                console.log("email sent");
                resolve(info);
                errorSwitch = true;
              }
            });
          });
        };
        // if(errorSwitch === false){
        sendError(mailOptions, transporter);
        // }

        let smsInfo =
          "posting error: " +
          orderInfo.billing.billing_name.replace("nx", "") +
          ` please enter this order for ${moment(
            orderInfo.fulfillment_info.estimated_fulfillment_time
          )
            .tz("America/Los_Angeles")
            .format("LT")} check your email to see the order to enter.`;

        // end send email logic:
        Promise.all(
          phoneNumbers.map((number) => {
            return client.messages.create({
              to: number,
              from: "+12062087871",
              body: smsInfo,
            });
          })
        )
          .then((messages) => {
            console.log("Messages sent!");
          })
          .catch((err) => console.error(err));

        // end put the recipients in here
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    // res.status(400).json({ err: err });
    console.log("error");
  }
};

// let reqBody = { orderInfo:{
//   timeStamp: 1628549888969,
//   tipSelected: 0,
//   currentAmountToAddCustom: 0,
//   sms: false,
//   restaurant: "Mamnoon Street",
//   billing: {
//     billing_name: "joseph p waine",
//     billing_address: "116 30th Ave S 1",
//     billing_postal_code: "98122",
//   },
//   id: "d0xbpr89c87_3khgfpg4jwr_558znsgh569",
//   preorder: false,
//   scheduled_time: null,
//   time_placed: "2022-03-26T23:14:43.710Z",
//   confirmation_code: "mamnoon-f1c6yhtmrno",
//   charges: {
//     total: 0,
//     preTotal: 0,
//     fees: 0,
//     taxes: 0,
//     tip: {
//       amountOptions: [0, 0, 0, 0, 0],
//       amount: 0,
//       payment_type: "Nadi Mama",
//     },
//     items: [],
//   },
//   fulfillment_info: {
//     type: "pickup",
//     estimated_fulfillment_time: "2021-08-09T23:14:43.710Z",
//     customer: {
//       email: "joe@mamnoonrestaurant.com",
//       phone: "4254429308",
//       first_name: "joe",
//     },
//     instructions: "",
//     no_tableware: false,
//     delivery_info: {
//       is_managed_delivery: false,
//       address: {
//         city: "seattle",
//         state: "WA",
//         zip_code: "98144",
//         address_line1: "1745 12th Avenue South",
//         address_line2: "#2",
//       },
//     },
//   },
//   payments: {
//     payments: [
//       {
//         payment_type: "Nadi Mama",
//         amount: 0,
//       },
//     ],
//   }
// }};

// oloOrderFromIndex(reqBody);
