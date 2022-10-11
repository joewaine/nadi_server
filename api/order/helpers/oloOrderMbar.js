const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();
const {fNameAndConfirmCode, otherRestaurants, contactInfo, fullAddressAndName, sendVoidReturnCancelEmail, cancelConfirmCode, itemList}
= require('../../emails/emailTemplateHelpers')
const nodemailer = require("nodemailer");
const PNF = require("google-libphonenumber").PhoneNumberFormat;

let localEmail = ''

if(process.env.LOCAL_ENVIRONMENT === 'true'){
  localEmail = '[local email] '
}

const postOrderMbar = async (req, resData, res) => {
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
    if (resData.result === "success") {
      res.send(req.body);

      let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}`;

      if (req.body.fulfillment_info.type === "delivery") {
        htmlBody = htmlBody + `Your Order Has Been Placed!</h1></div>`;
      } else {
        htmlBody = htmlBody + `Your Order Has Been Placed!</h1></div>`;
      }

      htmlBody =
        htmlBody +
        fNameAndConfirmCode(
          req.body.fulfillment_info,
          req.body
        );
      // for (let i = 0; i < req.body.charges.items.length; i++) {
      //   htmlBody =
      //     htmlBody +
      //     '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
      //     JSON.stringify(req.body.charges.items[i].name) +
      //     "&nbsp;<b>$" +
      //     JSON.stringify(req.body.charges.items[i].price) / 100 +
      //     "</b>&nbsp;x&nbsp;" +
      //     JSON.stringify(req.body.charges.items[i].quantity) +
      //     "</li>";
      // }


      htmlBody = htmlBody + itemList(req.body);





      let phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12064578287">(206) 457-8287</a>';

      htmlBody =
        htmlBody +
        `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at Mbar.<br><br><i>400 Fairview Ave N 14th Floor, Seattle, WA 98109</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

      htmlBody = htmlBody + feedbackParagraph + otherRestaurants();
      var mailOptions = {
        from: "orders@mamnoonrestaurant.com",
        to: req.body.fulfillment_info.customer.email,
        bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
        // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
        subject: `${process.env.LOCAL_ENVIRONMENT}Your Mbar Pickup Order Has Been Placed! We will notify you when your food is being prepared.`,
        html: htmlBody,
      };

      sendMailBasic(mailOptions, transporter);

      const number = phoneUtil.parseAndKeepRawInput(
        req.body.fulfillment_info.customer.phone,
        "US"
      );
      let smsNumber = phoneUtil.format(number, PNF.E164);

      // console.log('send text message - mbar order ready')
      if (req.body.sms === true) {
        client.messages.create({
          to: smsNumber,
          from: "+12062087871",
          body: `Your Mbar Pickup Order Has Been Placed! Estimated pickup time is 20 minutes.`,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { postOrderMbar };