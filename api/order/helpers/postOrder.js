const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();
const {fNameAndConfirmCode, contactInfo, fullAddressAndName, sendVoidReturnCancelEmail, cancelConfirmCode, itemList}
= require('../../emails/emailTemplateHelpers')
const nodemailer = require("nodemailer");
const PNF = require("google-libphonenumber").PhoneNumberFormat;
const m = require('../../../mongoOrderHelpers');

const twilio = require("twilio");
let client = new twilio(
  process.env.TWILIO_FIRST_VAR,
  process.env.TWILIO_SECOND_VAR
);


let localEmail = ''

if(process.env.LOCAL_ENVIRONMENT === 'true'){

  localEmail = '[local email] '
}

const postScheduledOrder = (req) => {
  // console.log('req');
  // console.log('req');
  // console.log('req');
  // console.log('req');
  // console.log(req);
    const sendMailBasic = function (mailOptions2, transporter) {
        // console.log()
        return new Promise(function (resolve, reject) {
          transporter.sendMail(mailOptions2, function (error, info) {
            if (error) {
              console.log("email not sent");s
              reject(error);
            } else {
              console.log("email sent");
              resolve(info);
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

    // if (resData.result === "success") {
        
        let j = 0;
        if (j === 0) {
          // console.log(req)
          // console.log(resData.result)
          let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}`;

          // if (req.fulfillment_info.type === "delivery") {
          //   htmlBody =
          //     htmlBody + `Your Scheduled Order Has Been Placed!</h1></div>`;
          // } else {
          //   htmlBody =
          //     htmlBody +
          //     `Your Scheduled Pickup Order Has Been Placed!</h1></div>`;
          // }


          htmlBody =
          htmlBody +
          `Your Scheduled Pickup Order Is Being Prepared!</h1></div>`;

          htmlBody =
            htmlBody + fNameAndConfirmCode(req.fulfillment_info, req);



          htmlBody = htmlBody + itemList(req);




          let addressToInsert = "";
          let phoneNumber = "";

          if (req.restaurant === "Mamnoon Street") {
            addressToInsert = "2020 6th Ave, Seattle, WA 98121";
            phoneNumber =
              '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
          }

          if (req.restaurant === "Mamnoon") {
            addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
            phoneNumber =
              '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
          }

          htmlBody =
            htmlBody +
            `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at ${req.restaurant}.<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

          var mailOptions = {
            from: "orders@mamnoonrestaurant.com",
            to: req.fulfillment_info.customer.email,
            bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
            // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
            subject: `${process.env.LOCAL_ENVIRONMENT}Your Mamnoon Pickup Order Is Being Prepared! We will notify you when your food is ready.`,
            html: htmlBody,
          };

          // sendMailBasic(mailOptions, transporter);

          const number = phoneUtil.parseAndKeepRawInput(
            req.fulfillment_info.customer.phone,
            "US"
          );
          let smsNumber = phoneUtil.format(number, PNF.E164);

          // Send the text message.
          // if (req.sms === true) {
            // console.log('send text message')
            console.log(smsNumber);
console.log(smsNumber);

            client.messages.create({
              to: smsNumber,
              from: "+12062087871",
              body: `Hi this is ${req.restaurant}. Your order ${req.confirmation_code} is being prepared now, we’ll see you soon!`,
            }).then(message => console.log(message.sid));
          // }


          m.orderPostedTrue(req.id);

          j = 1;
        }
      // }
}

module.exports = { postScheduledOrder }