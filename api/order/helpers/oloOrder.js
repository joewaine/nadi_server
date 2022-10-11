const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();
const {otherRestaurants, fNameAndConfirmCode, contactInfo, fullAddressAndName, sendVoidReturnCancelEmail, cancelConfirmCode, itemList}
= require('../../emails/emailTemplateHelpers')
const nodemailer = require("nodemailer");
const PNF = require("google-libphonenumber").PhoneNumberFormat;
const m = require('../../../mongoOrderHelpers');
let localEmail = ''

if(process.env.LOCAL_ENVIRONMENT === 'true'){
  localEmail = '[local email] '
}

const postOrder = async (req, resData, res) => {
 
  const sendMailBasic = function (mailOptions2, transporter) {
    // console.log()
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
          console.log("email not sent");
          reject(error);
        } else {

          m.orderPostedTrue(req.id);

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
        htmlBody = htmlBody + `Your Order Is Being Prepared!</h1></div>`;
      } else {
        htmlBody = htmlBody + `Your Order Is Being Prepared!</h1></div>`;
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


      htmlBody = htmlBody + contactInfo();
      htmlBody = htmlBody + feedbackParagraph + otherRestaurants();
      var mailOptions = {
        from: "orders@mamnoonrestaurant.com",
        to: req.body.fulfillment_info.customer.email,
        bcc: "joe@mamnoonrestaurant.com",
        // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
        subject: `${process.env.LOCAL_ENVIRONMENT}Your Order Is Being Prepared! We will notify you when your food is ready.`,
        html: htmlBody,
      };

      sendMailBasic(mailOptions, transporter);

      console.log("sendMailBasic was hit above this clo");

      const number = phoneUtil.parseAndKeepRawInput(
        req.body.fulfillment_info.customer.phone,
        "US"
      );
      let smsNumber = phoneUtil.format(number, PNF.E164);

      // Send the text message.
      if (req.body.sms === true) {
        client.messages.create({
          to: smsNumber,
          from: "+12062087871",
          body: "Your Mamnoon Pickup Order Has Been Placed! We will notify you when your food is being prepared. Thank You.",
        });
      }
    }
  } catch (error) {
    console.log("error from catch oloOrder.js", error);
  }
};

module.exports = { postOrder };




const postOrderTest = async (req) => {
 
  const sendMailBasic = function (mailOptions2, transporter) {
    // console.log()
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
          console.log("email not sent");
          reject(error);
        } else {

          m.orderPostedTrue(req.id);

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
    // if (resData.result === "success") {
      // res.send(req.body);

      let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}`;

      if (req.body.fulfillment_info.type === "delivery") {
        htmlBody = htmlBody + `Your Order Is Being Prepared!</h1></div>`;
      } else {
        htmlBody = htmlBody + `Your Order Is Being Prepared!</h1></div>`;
      }

      htmlBody =
        htmlBody +
        fNameAndConfirmCode(
          req.body.fulfillment_info,
          req.body
        );


      htmlBody = htmlBody + itemList(req.body);


      htmlBody = htmlBody + contactInfo();
      htmlBody = htmlBody + feedbackParagraph;
      var mailOptions = {
        from: "orders@mamnoonrestaurant.com",
        to: req.body.fulfillment_info.customer.email,
        bcc: "joe@mamnoonrestaurant.com",
        // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
        subject: `${process.env.LOCAL_ENVIRONMENT}Your Order Is Being Prepared! We will notify you when your food is ready.`,
        html: htmlBody,
      };

      sendMailBasic(mailOptions, transporter);

      console.log("sendMailBasic was hit above this clo");

      const number = phoneUtil.parseAndKeepRawInput(
        req.body.fulfillment_info.customer.phone,
        "US"
      );
      let smsNumber = phoneUtil.format(number, PNF.E164);

      // Send the text message.
      if (req.body.sms === true) {
        client.messages.create({
          to: smsNumber,
          from: "+12062087871",
          body: "Your Mamnoon Pickup Order Has Been Placed! We will notify you when your food is being prepared. Thank You.",
        });
      }
    // }
  } catch (error) {
    console.log("error from catch oloOrder.js", error);
  }
};



let orderBody = {body:{
  "timestamp": 1646703342683,
  "tipselected": 0,
  "currentamounttoaddcustom": 0,
  "sms": false,
  "restaurant": "mamnoon",
  "billing": {
    "billing_name": "joseph p waine",
    "billing_address": "1745 12th avenue south #2",
    "billing_address_city": "seattle",
    "billing_address_state": "wa",
    "billing_postal_code": "98222",
    "billing_address_unit": ""
  },
  "id": "pa3ycrbtvu_hq93jklw2fw_oy270o5f2ql",
  "preorder": true,
  "scheduled_time": null,
  "time_placed": "2022-03-08t01:35:33.530z",
  "confirmation_code": "mamnoon-0cdan2flerw",
  "charges": {
    "total": 6836,
    "preTotal": 6200,
    "fees": 0,
    "taxes": 636,
    "tip": {
      "amountoptions": [
        0,
        1116,
        1364,
        1550,
        0
      ],
      "amount": 0,
      "payment_type": "nadi mama"
    },
    "items": [
      {
        "name": "bombolles *half off!*",
        "cartid": "7xpcp0lo5la_cm8g4owdxnn_iccp185kv7",
        "item_id": "3ce377f6-44a4-4eb8-934d-9b37a34a84ea",
        "price": 3200,
        "price_cents": 3200,
        "quantity": 1,
        "instructions": "",
        "modifiers": [],
        "modifier_group_ids": [],
        "sides": [],
        "timing_mask": {
          "id": "23863d1c-ab3e-4957-be3a-36f2c25e96f6",
          "start_time": "16:00",
          "end_time": "23:00",
          "rules": [
            "tue",
            "wed",
            "thu",
            "fri",
            "sat"
          ],
          "status": "enabled",
          "owner_id": "9a3cf103-907e-47db-95d7-bde5025faaf4"
        },
        "images": {
          "online_ordering_menu": {
            "main": "https://res-5.cloudinary.com/upserve/image/upload/v1634852802/sbef1qgcrweexlaelhdz.jpg"
          }
        },
        "item_object": {
          "id": "3ce377f6-44a4-4eb8-934d-9b37a34a84ea",
          "name": "bombolles *half off!*",
          "price": "32.0",
          "price_cents": 3200,
          "description": "josep i pau, rose of pinot noir, 2019\r\ncatalonia, spain\r\nnotes: organic & natural, 36 year old vines, semi-disgorged, dry, bright citrus, crisp apple. pétillant naturel (sparkling) rose wine.\r\n\r\n*you must order food with purchase of alcoholic drinks and please have id ready to show at the time of pick up.*",
          "min_sides": 0,
          "max_sides": 0,
          "item_type": "normal",
          "tax_inclusive": false,
          "images": {
            "online_ordering_menu": {
              "main": "https://res-5.cloudinary.com/upserve/image/upload/v1634852802/sbef1qgcrweexlaelhdz.jpg"
            }
          },
          "tax_rate_id": "4c4734ea-c91d-412e-a2e3-67a8409908bf",
          "item_images": [
            {
              "id": "580f99d3-ada2-48ea-a408-dece62f00fc4",
              "metadata": {
                "image_path": "v1634852802/sbef1qgcrweexlaelhdz.jpg",
                "curated": false,
                "url": "https://res-5.cloudinary.com/upserve/image/upload/v1634852802/sbef1qgcrweexlaelhdz.jpg"
              },
              "url": "https://res-5.cloudinary.com/upserve/image/upload/v1634852802/sbef1qgcrweexlaelhdz.jpg"
            }
          ],
          "modifier_group_ids": [],
          "side_ids": [],
          "tax_rate_ids": [],
          "timing_mask": {
            "id": "23863d1c-ab3e-4957-be3a-36f2c25e96f6",
            "start_time": "16:00",
            "end_time": "23:00",
            "rules": [
              "tue",
              "wed",
              "thu",
              "fri",
              "sat"
            ],
            "status": "enabled",
            "owner_id": "9a3cf103-907e-47db-95d7-bde5025faaf4"
          }
        }
      },
      {
        "name": "diet coke",
        "cartid": "vez2zbobltl_91ezajkubvj_ine3tb6c9qj",
        "item_id": "c7b76616-cbde-4cf6-bc67-4cf52d316c40",
        "price": 300,
        "price_cents": 300,
        "quantity": 1,
        "instructions": "hello",
        "modifiers": [],
        "modifier_group_ids": [],
        "sides": [],
        "timing_mask": null,
        "images": {
          "online_ordering_menu": {
            "main": "https://res-1.cloudinary.com/upserve/image/upload/v1614222000/lej2ontoakhdww5pic0k.webp"
          }
        },
        "item_object": {
          "id": "c7b76616-cbde-4cf6-bc67-4cf52d316c40",
          "name": "diet coke",
          "price": "3.0",
          "price_cents": 300,
          "description": "classic diet coke",
          "min_sides": 0,
          "max_sides": 0,
          "item_type": "normal",
          "tax_inclusive": false,
          "images": {
            "online_ordering_menu": {
              "main": "https://res-1.cloudinary.com/upserve/image/upload/v1614222000/lej2ontoakhdww5pic0k.webp"
            }
          },
          "tax_rate_id": "4c4734ea-c91d-412e-a2e3-67a8409908bf",
          "item_images": [
            {
              "id": "89027cdf-cb64-4b9e-a601-152d1a643a0e",
              "metadata": {
                "image_path": "v1614222000/lej2ontoakhdww5pic0k.webp",
                "curated": false,
                "url": "https://res-1.cloudinary.com/upserve/image/upload/v1614222000/lej2ontoakhdww5pic0k.webp"
              },
              "url": "https://res-1.cloudinary.com/upserve/image/upload/v1614222000/lej2ontoakhdww5pic0k.webp"
            }
          ],
          "modifier_group_ids": [],
          "side_ids": [],
          "tax_rate_ids": [],
          "timing_mask": null
        }
      },
      {
        "name": "shorabat adas",
        "cartid": "k4o2bsvljfo_oaew3341lh_x0dr1r9mmc",
        "item_id": "bceb812f-16dc-465c-b7b7-8ea8894b7eb9",
        "price": 700,
        "price_cents": 700,
        "quantity": 1,
        "instructions": "yeum yeum yeum yeum yeum yeum yeum yeum yeum yeum yeum yeum yeum yeum yeum yeum yeum yeum ",
        "modifiers": [],
        "modifier_group_ids": [],
        "sides": [],
        "timing_mask": {
          "id": "321040f1-b62d-4563-a973-079877fb7826",
          "start_time": "11:00",
          "end_time": "14:30",
          "rules": [
            "tue",
            "wed",
            "thu",
            "fri",
            "sat"
          ],
          "status": "enabled",
          "owner_id": "535e97a6-4a34-4d01-b1e1-302f71ef34f1"
        },
        "images": {
          "online_ordering_menu": {
            "main": "https://res-3.cloudinary.com/upserve/image/upload/v1597342519/xhrzde5ntazegcznoaka.jpg"
          }
        },
        "item_object": {
          "id": "bceb812f-16dc-465c-b7b7-8ea8894b7eb9",
          "name": "shorabat adas",
          "price": "7.0",
          "price_cents": 700,
          "description": "red lentil soup, turmeric, coriander, crispy pita ",
          "min_sides": 0,
          "max_sides": 0,
          "item_type": "normal",
          "tax_inclusive": false,
          "images": {
            "online_ordering_menu": {
              "main": "https://res-3.cloudinary.com/upserve/image/upload/v1597342519/xhrzde5ntazegcznoaka.jpg"
            }
          },
          "tax_rate_id": "4c4734ea-c91d-412e-a2e3-67a8409908bf",
          "item_images": [
            {
              "id": "e4e5bee7-5e2e-4155-931e-ef51e4be6dc9",
              "metadata": {
                "image_path": "v1597342519/xhrzde5ntazegcznoaka.jpg",
                "curated": false,
                "url": "https://res-3.cloudinary.com/upserve/image/upload/v1597342519/xhrzde5ntazegcznoaka.jpg"
              },
              "url": "https://res-3.cloudinary.com/upserve/image/upload/v1597342519/xhrzde5ntazegcznoaka.jpg"
            }
          ],
          "modifier_group_ids": [],
          "side_ids": [],
          "tax_rate_ids": [],
          "timing_mask": {
            "id": "321040f1-b62d-4563-a973-079877fb7826",
            "start_time": "11:00",
            "end_time": "14:30",
            "rules": [
              "tue",
              "wed",
              "thu",
              "fri",
              "sat"
            ],
            "status": "enabled",
            "owner_id": "535e97a6-4a34-4d01-b1e1-302f71ef34f1"
          }
        }
      },
      {
        "name": "za'atar man'oushe ",
        "cartid": "9ytdhpv99kq_wyqwcukcd0g_vp7rt3vr0w9",
        "item_id": "4965a936-7c93-4b47-b86b-d7d41adec278",
        "price": 900,
        "price_cents": 900,
        "quantity": 1,
        "instructions": "adscasd asdasdf",
        "modifiers": [
          {
            "id": "12b61d28-c355-41be-9d53-63d81584a248",
            "modifier_group_id": "a024a7f9-2199-4684-b351-37d6cec41447",
            "price": 300,
            "name": "add falafel"
          },
          {
            "id": "ef0c6502-30fc-4d0a-b14a-2dab0e10b79b",
            "modifier_group_id": "a024a7f9-2199-4684-b351-37d6cec41447",
            "price": 400,
            "name": "add chicken"
          },
          {
            "id": "97f6a086-46fb-43ec-8f57-f4120cff6acf",
            "modifier_group_id": "a024a7f9-2199-4684-b351-37d6cec41447",
            "price": 400,
            "name": "add halloumi cheese"
          }
        ],
        "modifier_group_ids": [
          "a024a7f9-2199-4684-b351-37d6cec41447"
        ],
        "sides": [],
        "timing_mask": {
          "id": "1c4875c6-e953-486b-b8d6-3287144e5534",
          "start_time": "16:00",
          "end_time": "20:00",
          "rules": [
            "tue",
            "wed",
            "thu",
            "fri",
            "sat"
          ],
          "status": "enabled",
          "owner_id": "ba115845-bb01-4cd1-8f33-8097d6d12db9"
        },
        "images": {
          "online_ordering_menu": {
            "main": "https://res-1.cloudinary.com/upserve/image/upload/v1598579793/gppll9561fcdwxn18n8f.jpg"
          }
        },
        "item_object": {
          "id": "4965a936-7c93-4b47-b86b-d7d41adec278",
          "name": "za'atar man'oushe ",
          "price": "9.0",
          "price_cents": 900,
          "description": "king of lebanese street food! wild thyme,\r\nsesame, olive, labneh, tomato, herbs, arabic bread",
          "min_sides": 0,
          "max_sides": 0,
          "item_type": "normal",
          "tax_inclusive": false,
          "images": {
            "online_ordering_menu": {
              "main": "https://res-1.cloudinary.com/upserve/image/upload/v1598579793/gppll9561fcdwxn18n8f.jpg"
            }
          },
          "tax_rate_id": "4c4734ea-c91d-412e-a2e3-67a8409908bf",
          "item_images": [
            {
              "id": "403e45be-96c2-404b-9ec2-5e0c4cfe670d",
              "metadata": {
                "image_path": "v1598579793/gppll9561fcdwxn18n8f.jpg",
                "curated": false,
                "url": "https://res-1.cloudinary.com/upserve/image/upload/v1598579793/gppll9561fcdwxn18n8f.jpg"
              },
              "url": "https://res-1.cloudinary.com/upserve/image/upload/v1598579793/gppll9561fcdwxn18n8f.jpg"
            }
          ],
          "modifier_group_ids": [
            "a024a7f9-2199-4684-b351-37d6cec41447"
          ],
          "side_ids": [],
          "tax_rate_ids": [],
          "timing_mask": {
            "id": "1c4875c6-e953-486b-b8d6-3287144e5534",
            "start_time": "16:00",
            "end_time": "20:00",
            "rules": [
              "tue",
              "wed",
              "thu",
              "fri",
              "sat"
            ],
            "status": "enabled",
            "owner_id": "ba115845-bb01-4cd1-8f33-8097d6d12db9"
          }
        }
      }
    ]
  },
  "fulfillment_info": {
    "type": "pickup",
    "estimated_fulfillment_time": "2022-03-08t01:35:33.530z",
    "customer": {
      "email": "joe.waine@gmail.com",
      "phone": "4254429308",
      "first_name": "joe waine",
      "last_name": ""
    },
    "instructions": "",
    "no_tableware": false,
    "delivery_info": {
      "is_managed_delivery": false,
      "address": {
        "city": "",
        "state": "",
        "zip_code": "",
        "address_line1": "",
        "address_line2": ""
      }
    }
  },
  "payments": {
    "payments": [
      {
        "payment_type": "nadi mama",
        "amount": 6836
      }
    ]
  }
}}


// postOrderTest(orderBody);