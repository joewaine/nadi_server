const Package = require("../model/Package");
const fetch = require("node-fetch");
const btoa = require("btoa");
const axios = require("axios");
const e = require("express");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "orders@mamnoonrestaurant.com",
    pass: "orders4mama",
  },
});

var sdk = require("emergepay-sdk");


exports.retrieve = async (req, res) => {
  try {
    const packs = await Package.find({});
    // console.log('retrieval hide')
    res.status(200).json({ packs });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};


exports.retrieveOne = async (req, res) => {
  try {
    const package = await Package.findOne({upserveId: req.params.upserveid});
    // console.log('retrieval hide')
    res.status(200).json({ package });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};



let localEmail = ''

if(process.env.LOCAL_ENVIRONMENT === 'true'){
  localEmail = '[local email] '
}


exports.addPackage = async (req, res) => {
  //  let addPackage = async () => {

  try {
    console.log(req.body);

    // const package = new Package({
    //   name: 'packageName',
    //   upserveId: '12345',
    //   orderDate: '12-9-1010',
    //   number: '20',
    //   soldOut: false
    // })

    const package = new Package(req.body);

    let data = await package.save();
    console.log("package saved");
    res.status(200).json({ data });
    console.log("success add package from con");
  } catch (err) {
    res.status(400).json({ err: err });
    console.log("error");
  }
};

// addPackage();


let checkIfSoldOutAndSendEmailByMongoId = async (idToCheck) => {
  console.log(idToCheck);
  console.log(idToCheck);
  const packageDelete = await Package.findOne(
    { _id: idToCheck },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {

console.log(docs);

        // console.log("packagwe to check if sold out and send email : ", docs);

        if (docs.number === 0) {
          console.log("send sold out email!");

          var mailOptionsSoldOut = {
            from: "orders@mamnoonrestaurant.com",
            to: docs.recipients.join(', '),
            subject: `${process.env.LOCAL_ENVIRONMENT}SOLD OUT ${docs.number} of ${docs.name} packages remaining`,
            html: `SOLD OUT ${docs.number} of ${docs.name} packages remaining`,
          };
          const sendMailSoldOut = function (mailOptionsSoldOut, transporter) {
            console.log();
            return new Promise(function (resolve, reject) {
              transporter.sendMail(mailOptionsSoldOut, function (error, info) {
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
          sendMailSoldOut(mailOptionsSoldOut, transporter);
        } else {
          var mailOptions = {
            from: "orders@mamnoonrestaurant.com",
            to: docs.recipients.join(', '),
            subject: `${process.env.LOCAL_ENVIRONMENT}${docs.number} of ${docs.name} packages remaining`,
            html: `${docs.number} of ${docs.name} packages remaining`,
          };
          const sendMail = function (mailOptions, transporter) {
            console.log();
            return new Promise(function (resolve, reject) {
              transporter.sendMail(mailOptions, function (error, info) {
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
          sendMail(mailOptions, transporter);

          console.log("send remainder email");
        }
      }
    }
  );

  // res.status(201).json({ packageDelete });
};




let checkIfSoldOutAndSendEmail = async (idToCheck) => {
  console.log(idToCheck);
  console.log(idToCheck);
  const packageDelete = await Package.findOne(
    { upserveId: idToCheck.upserveId },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {

console.log(docs);

        // console.log("packagwe to check if sold out and send email : ", docs);
        if (docs !== null) {
        if (docs.number === 0) {
          console.log("send sold out email!");

          var mailOptionsSoldOut = {
            from: "orders@mamnoonrestaurant.com",
            to: docs.recipients.join(','),
            subject: `${process.env.LOCAL_ENVIRONMENT}SOLD OUT ${docs.number} of ${docs.name} packages remaining`,
            html: `SOLD OUT ${docs.number} of ${docs.name} packages remaining`,
          };
          const sendMailSoldOut = function (mailOptionsSoldOut, transporter) {
            console.log();
            return new Promise(function (resolve, reject) {
              transporter.sendMail(mailOptionsSoldOut, function (error, info) {
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
          sendMailSoldOut(mailOptionsSoldOut, transporter);
        } else {
          var mailOptions = {
            from: "orders@mamnoonrestaurant.com",
            to: docs.recipients.join(', '),
            subject: `${process.env.LOCAL_ENVIRONMENT}${docs.number} of ${docs.name} packages remaining`,
            html: `${docs.number} of ${docs.name} packages remaining`,
          };
          const sendMail = function (mailOptions, transporter) {
            console.log();
            return new Promise(function (resolve, reject) {
              transporter.sendMail(mailOptions, function (error, info) {
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
          sendMail(mailOptions, transporter);

          console.log("send remainder email");
        }


      }


      }
    }
  );

  // res.status(201).json({ packageDelete });
};

exports.decrementPackageByUpserveId = async (req, res) => {
  // async function decrementPackage() {
  console.log(req.body);
  console.log("decrement");
  console.log(req.body.amount);
  console.log(req.body.amount);
  console.log(req.body.amount);
  try {
    await Package.updateOne(
      { upserveId: req.body.upserveId },
      { $inc: { number: -req.body.amount } }
    ).then(function (decInfo) {
      console.log(`decremented by${req.body.amount}`);

      console.log(decInfo);

      checkIfSoldOutAndSendEmail(req.body.upserveId);
    });
    res.status(201).json({ status: 201 });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.decrementPackage = async (req, res) => {
  // async function decrementPackage() {
  console.log(req.body);
  console.log("decrement");
  try {
    await Package.updateOne(
      { _id: req.body._id },
      { $inc: { number: -1 } }
    ).then(function (docs) {


      console.log(req.body);
      checkIfSoldOutAndSendEmailByMongoId(req.body._id);

      // checkIfSoldOutAndSendEmail()

      console.log(docs);
      console.log("decremented by one");
    });
    res.status(201).json({ status: 201 });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};


exports.incrementPackage = async (req, res) => {
  // async function decrementPackage() {
  console.log(req.body);
  console.log("increment");
  try {
    await Package.updateOne(
      { _id: req.body._id },
      { $inc: { number: 1 } }
    ).then(function (docs) {


      console.log(req.body);
      // checkIfSoldOutAndSendEmailByMongoId(req.body._id);

      // checkIfSoldOutAndSendEmail()

      console.log(docs);
      console.log("incremented by one");
    });
    res.status(201).json({ status: 201 });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};





// exports.deletePackage = async (req, res) => {

//   // async function decrementPackage() {
//     console.log(req.body)
//     console.log('delete')
//       try {
//        await Package.updateOne({ "_id": req.body._id },{ "$inc": { "number": -1 } }).then(function(){
//           console.log('decremented by one');
//       })
//       res.status(201).json({ status: 201 });
//       } catch (err) {
//         res.status(400).json({ err: err });
//       }
//     };

exports.deletePackage = async (req, res) => {
  const packageDelete = await Package.findOneAndDelete(
    { _id: req.body._id },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted Package : ", docs);
      }
    }
  );

  res.status(201).json({ packageDelete });
};

// decrementPackage();

// exports.retrievePackages = async (req, res) => {
// console.log(req.params.email)

//   try {
//    const user = await Package.findByPackageEmail(req.params.email)

//   res.status(201).json({ user });
//    } catch (err) {

//   }
//  };
