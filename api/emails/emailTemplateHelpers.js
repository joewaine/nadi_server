const nodemailer = require("nodemailer");
const moment = require("moment");
const tz = require("moment-timezone");
const fNameAndConfirmCode = (fulfill, body) => {
  return `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Thanks for your order, ${fulfill.customer.first_name.replace('nx ','')}!<br>
  <br><span style="font-size: 20px !important;">confirmation code: <b>${body.confirmation_code}</b></span><br/><br/><b>Your food will be ready for pickup around ${moment(body.fulfillment_info.estimated_fulfillment_time).tz("America/Los_Angeles").format('LT')}</b><br/>We'll see you soon at ${body.restaurant}<br/></p><br/>`;
};




function showToFixed(value) {
  // let decvalue = value/100
  return value.toFixed(2).replace('.00', '')
}


function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
};





const itemList = (req) =>{
  
  let htmlBody = '<table style="text-align: left;padding-left: 0 !important;margin:0 auto !important;list-style-type:none !important;"><tr><th><b>item</b></th><th><b>quantity</b></th><th><b>total</b></th></tr>';

  for (let i = 0; i < req.charges.items.length; i++) {

    let modifiers = '';


    let modifierPrice = 0;

      if(req.charges.items[i].modifiers.length > 0 ){

        modifiers = modifiers + '<ul style="font-size: 10px;padding-left: 0;list-style-type:none;">';

        for (let j = 0; j < req.charges.items[i].modifiers.length; j++){
          modifiers = modifiers + 
          '<li style="margin-left: 0;"><i>' + JSON.stringify(truncate(req.charges.items[i].modifiers[j].name,24)) +
          '<b>+$' + showToFixed(JSON.stringify(req.charges.items[i].modifiers[j].price)/100) + '</b></i></li>'


          modifierPrice = modifierPrice + req.charges.items[i].modifiers[j].price;

        }

        modifiers = modifiers + '</ul>';

      }  

      let notes = '';





      if(req.charges.items[i].instructions !== "" ){
        notes = '<i style="font-size:8px;display:block">('+ truncate(req.charges.items[i].instructions,16) + ')</i>'

      }


 

      let priceTotal = req.charges.items[i].price + modifierPrice;






    htmlBody =
      htmlBody +
      '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td><b>' +
      JSON.stringify(req.charges.items[i].name) + modifiers + notes +
      "&nbsp;&nbsp;</b></td><td>" +
      JSON.stringify(req.charges.items[i].quantity) 
      +
      "&nbsp;&nbsp;</b></td><td>$" +
      showToFixed(priceTotal / 100) +
      "</td></tr>";
  }


      htmlBody = htmlBody +  '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td>subtotal:&nbsp;$' +
      showToFixed(JSON.stringify(req.charges.preTotal) / 100) +
      '</td></tr>';

      htmlBody = htmlBody +  '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td>tip:&nbsp;$' +
      showToFixed(JSON.stringify(req.charges.tip.amount) / 100) +
    '</td></tr>';


    htmlBody = htmlBody +  '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td>taxes:&nbsp;$' +
    showToFixed(JSON.stringify(req.charges.taxes) / 100) +
  '</td></tr>';


      htmlBody = htmlBody +  '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td><b>total:&nbsp;$' +
      showToFixed(JSON.stringify(req.charges.total) / 100) +
    '</b></td></tr>';

      
    htmlBody = htmlBody +  '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td><br><b>Billing Information</b></td></tr>';

    htmlBody = htmlBody +  '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td>'+ req.billing.billing_name.replace("nx","")    +'</td></tr>';




htmlBody = htmlBody +  '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td>'+ req.fulfillment_info
.customer.phone    +'</td></tr>';

htmlBody = htmlBody +  '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td>'+ req.fulfillment_info
.customer.email    +'</td></tr>';

htmlBody = htmlBody +  '<tr style="padding-left: 0 !important;margin-left:0 !important;text-align: left;width: 100%;list-style-type:none !important;"><td>card payment</td></tr>';





    return htmlBody+'</table>';

}


const cancelConfirmCode = (body) => {
  return `<p style="text-align: center;margin: 0 auto;width: 100%;">
  <span style="font-size: 20px !important;">confirmation code: <b>${body.confirmation_code}</b></span></p><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;">`;
};

const voidFiller = (fulfill, body, str) => {
  let rslt = "";

  if (str === "void") {
    rslt =
      "Your order has been voided. Please wait 2-3 business days for your refund to be issued.";
  } else if (str === "return") {
    rslt =
      "You have been refunded. Please wait 2-3 business days for your refund to be issued.";
  } else if (str === "cancel") {
    rslt =
      "Your order has been cancelled. You will not be charged for this order.";
  }

  //no confirmation code add in at some point
  return `<p style="text-align: center;margin: 0 auto;width: 100%;"><br> ${rslt}<br>name: ${fulfill.customer.first_name.replace('nx ','')}<span style="font-size: 20px !important;">     
  </span></p><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;">`;
};

const contactInfo = () => {
  return `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at Mamnoon.<br><br><i>1508 Melrose Ave, Seattle WA 98122</i><br><a href="https://nadimama.com">nadimama.com</a><br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a></p>`;
};

const fullAddressAndName = (fulfill, body) => {
  return `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Thanks for your order!<br><br><span style="font-size: 20px !important;"><br>name: ${fulfill.customer.first_name.replace('nx ','')}<br>confirmation code: <b>${body.confirmation_code}</b></span><br/><br/>We are getting your order ready to ship!<br>Your shipment will be sent to ${fulfill.delivery_info.address.address_line1}, ${fulfill.delivery_info.address.address_line2}, ${fulfill.delivery_info.address.city}, ${fulfill.delivery_info.address.state}, ${fulfill.delivery_info.address.zip_code}</p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;">`;
};

const sendVoidReturnCancelEmail = (doc, str) => {
  let req = doc.orderInfo;

  const sendMailBasic = function (mailOptions2, transporter) {
    // console.log()
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
          console.log("email not sent");

          reject(error);
        } else {
          // console.log("email sent");

          if (str === "void") {
            console.log("void email sent");
            console.log("void email sent");
            console.log("void email sent");
          } else {
            console.log("return email sent");
            console.log("return email sent");
            console.log("return email sent");
          }

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

  let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">${process.env.LOCAL_ENVIRONMENT}`;

  if (str === "void") {
    htmlBody = htmlBody + `Your order has been voided</h1></div>`;
  } else if (str == "cancel") {
    htmlBody = htmlBody + `Your order has been cancelled</h1></div>`;
  } else {
    htmlBody = htmlBody + `You Have Been Refunded</h1></div>`;
  }

  htmlBody += voidFiller(req.fulfillment_info, doc, str);
  // htmlBody =
  htmlBody += cancelConfirmCode(req);
  for (let i = 0; i < req.charges.items.length; i++) {
    if (str === "return" && req.charges.items[i].returned === true) {
      htmlBody =
        htmlBody +
        '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
        JSON.stringify(req.charges.items[i].name) +
        "&nbsp;<b>$" + showToFixed(JSON.stringify(req.charges.items[i].price) / 100) +
        "</b>&nbsp;x&nbsp;" +
        JSON.stringify(req.charges.items[i].quantity) +
        "</li>";
    } else {
      htmlBody =
        htmlBody +
        '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
        JSON.stringify(req.charges.items[i].name) +
        "&nbsp;<b>$" +
        showToFixed(JSON.stringify(req.charges.items[i].price) / 100) +
        "</b>&nbsp;x&nbsp;" +
        JSON.stringify(req.charges.items[i].quantity) +
        "</li>";
    }
  }

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

  let subjectLine = "";
  if (str === "void") {
    subjectLine = "Your Order Has Been Voided";
  }

  if (str === "return") {
    subjectLine = "You Have Been Refunded";
  }

  if (str === "cancel") {
    subjectLine = "Your Order Has Been Cancelled";
  }

  var mailOptions = {
    from: "orders@mamnoonrestaurant.com",
    to: req.fulfillment_info.customer.email,
    bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
    // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
    subject: subjectLine,
    html: htmlBody,
  };
  console.log("Email sent from local backend")
  sendMailBasic(mailOptions, transporter);
};


















const otherRestaurants = () =>{
  return '<div> <div> <table cellpadding="0" cellspacing="0" align="center" width="600" bgcolor="#FFFFFF" style="min-width:600px"> <tbody> <tr> <td valign="top" align="center" style="padding-top:16px;padding-right:32px;padding-bottom:16px;padding-left:32px;vertical-align:top;background-color: #ffffff;margin-bottom: 20px;"> <table cellpadding="0" cellspacing="0" align="left" width="100%"> <tbody><tr> <td style="text-align: center;vertical-align:top" align="left" valign="top"> <span id="m_-8444121055108136678recommendations-title-caption" style="color:#000000!important;font-size:1.5rem;text-align:center;">Our Other Restaurants</span> </td> </tr> </tbody></table> </td> </tr> <tr> <td valign="top" align="center" style="padding-top:8px;padding-right:32px;padding-bottom:16px;padding-left:32px;vertical-align:top"> <table cellpadding="0" cellspacing="0" align="left" width="100%"> <tbody><tr> <td width="150" align="left" style="padding-right:45px" valign="top"> <table width="100%" cellpadding="0" cellspacing="0"> <tbody> <tr> <td valign="top" align="left" style="padding:0px"> <a href="https://www.nadimama.com/mamnoonstreet" style="text-decoration:none" target="_blank"> <img src="https://mamnoontogo.net/wp-content/uploads/2021/10/Screen-Shot-2021-10-13-at-12.40.10-PM-150x150.png" width="150" height="150" align="center"  border="0" style="display:inline-block;max-width:100%" class="CToWUd"> </a> <a href="" style="text-decoration:none;display:none" target="_blank"><img src="" width="0" height="0" align="center"  border="0" style="display:inline-block" class="CToWUd"></a> </td> </tr> <tr> <td valign="top" align="left" style="vertical-align:top;padding-top:16px;padding-bottom:4px"> <span style="font-size:16px;font-weight:normal;line-height:24px;color: black;">Mamnoon Street</span> </td> </tr><tr> <td valign="top" align="left" style="vertical-align:top;padding-top:4px;padding-bottom:8px"> <span style="font-size:14px;color:#666666;font-weight:normal;line-height:20px">South Lake Union</span> </td> </tr> <tr> <td valign="top" align="left" style="vertical-align:top"> <a href="https://www.nadimama.com/mamnoonstreet" style="text-decoration:none" target="_blank"> <span style="color: #f05d5b;font-size:16px;font-weight:normal;line-height:24px">View Now</span><span style="font-family:LucidaGrande;font-size:16px;font-weight:normal;line-height:24px;color: #f05d5b;"> →</span> </a> </td> </tr> </tbody> </table> </td> <td width="150" align="left" style="padding-right:45px" valign="top"> <table width="100%" cellpadding="0" cellspacing="0"> <tbody> <tr> <td valign="top" align="left" style="padding:0px"> <a href="https://www.nadimama.com/mbar" style="text-decoration:none" target="_blank"> <img src="https://mamnoontogo.net/wp-content/uploads/2021/10/Mbar-Patio-0177-150x150.jpg" width="150" height="150" align="center"  border="0" style="display:inline-block;max-width:100%" class="CToWUd"> </a> <a href="" style="text-decoration:none;display:none" target="_blank"><img src="https://ci3.googleusercontent.com/proxy/h1RCaTNl1vw8WG7aL29c4kjigggrxQPs_JkRWVYgk7niPzmYiARrtDLx8NqbEOAW1VEg-XL4kyxrhg0vnPySl5e2aw_rZYK4xdXJHEFlaBwJo-w6=s0-d-e1-ft#https://resizer.otstatic.com/v2/photos/wide-medium/2/42388386.jpg" width="0" height="0" align="center"  border="0" style="display:inline-block" class="CToWUd"></a> </td> </tr> <tr> <td valign="top" align="left" style="vertical-align:top;padding-top:16px;padding-bottom:4px"> <span style="font-size:16px;font-weight:normal;line-height:24px;color: black;">Mbar</span> </td> </tr><tr> <td valign="top" align="left" style="vertical-align:top;padding-top:4px;padding-bottom:8px"> <span style="font-size:14px;color:#666666;font-weight:normal;line-height:20px">South Lake Union</span> </td> </tr> <tr> <td valign="top" align="left" style="vertical-align:top"> <a href="https://www.nadimama.com/mbar" style="text-decoration:none" target="_blank"> <span style="color: #f05d5b;font-size:16px;font-weight:normal;line-height:24px">View Now</span><span style="font-family:LucidaGrande;color: #f05d5b;font-weight:normal;line-height:24px"> →</span> </a> </td> </tr> </tbody> </table> </td> <td width="150" align="left" style="padding-right:0px" valign="top"> <table width="100%" cellpadding="0" cellspacing="0"> <tbody> <tr> <td valign="top" align="left" style="padding:0px"> <a href="https://www.nadimama.com/anar" style="text-decoration:none" target="_blank"> <img src="https://mamnoontogo.net/wp-content/uploads/2021/10/anar-150x150.png " width="150" height="150" align="center"  border="0" style="display:inline-block;max-width:100%" class="CToWUd"> </a> <a href="" style="text-decoration:none;display:none" target="_blank"><img src="" width="0" height="0" align="center" alt="Anar" border="0" style="display:inline-block" class="CToWUd"></a> </td> </tr> <tr> <td valign="top" align="left" style="vertical-align:top;padding-top:16px;padding-bottom:4px"> <span style="font-size:16px;font-weight:normal;line-height:24px;color: black;">Anar</span> </td> </tr><tr> <td valign="top" align="left" style="vertical-align:top;padding-top:4px;padding-bottom:8px"> <span style="font-size:14px;color:#666666;font-weight:normal;line-height:20px">South Lake Union</span> </td> </tr> <tr> <td valign="top" align="left" style="vertical-align:top"> <a href="https://www.nadimama.com/anar" style="text-decoration:none" target="_blank"> <span style="color: #f05d5b;font-size:16px;font-weight:normal;line-height:24px">View Now</span><span style="font-family:LucidaGrande;color: #f05d5b;font-size:16px;font-weight:normal;line-height:24px"> →</span> </a> </td> </tr> </tbody> </table> </td> </tr> </tbody></table> </td><td> </td></tr> </tbody> </table> </div></div>'


  
}







module.exports = {
  fNameAndConfirmCode,
  contactInfo,
  fullAddressAndName,
  sendVoidReturnCancelEmail,
  cancelConfirmCode,
  itemList,
  otherRestaurants
};

