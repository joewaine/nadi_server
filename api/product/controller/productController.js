const Product = require("../model/Product");
const fetch = require("node-fetch");
const btoa = require("btoa");

exports.addProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      menu: req.body.menu,
    });
    let data = await product.save();
    res.status(201).json({ data });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.snipCartProducts = async function (req, res) {
  const secret =
    "MTAyNTVhZGQtMzU2Mi00ZWEwLWI1ZjctNWQwY2MwYjZiYjZkNjM3MjYyOTQ3OTQ3OTcxNTA1";
  try {
    const request = await fetch("https://app.snipcart.com/api/products", {
      headers: {
        Authorization: `Basic ${btoa(secret)}`,
        Accept: "application/json",
      },
    });
    if (request.ok) {
      const body = await request.json();
      res.status(201).json({ body });
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.lookUpGiftCard = async (req, res) => {
  var xmlBodyStr = `request=<?xml version="1.0"?>
  <Trans>
  <Header>
      <FmtType>ClientWeb</FmtType>
      <FmtVer>1.0.0</FmtVer>
      <Uid>A7FEDD8B-BF2C-4D63-917D-4C1130ABFE4E</Uid>
      <Client>1047</Client>
      <ClientCode>B5C7A5CD-CAFB-4BE7-90F5-1A5ACB29292A</ClientCode>
      <Location>99992</Location>
      <Server>123</Server>
      <TransDate>${today}</TransDate>
      <TransTime>${currentTimeSliced}</TransTime>
      <POSSerial>12345</POSSerial>
  </Header>
  <Requests>
  <SvInquiry>
  <CardNbr>
  ${req.body.cardNumber}
  </CardNbr>
  </SvInquiry>
  </Requests>
  </Trans>`;

  var config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  axios
    .post("https://portal2.custcon.com/Partner/ProcessXml", xmlBodyStr, config)
    .then((response) => {
      let resData = response.data;
      // // console.log(resData)
      let resSendData = null;

      parseString(resData, function (err, result) {
        resSendData = result["Trans"];
      });
      res.send(201).json({ resSendData });
    })
    .catch((err) => {
      // // console.log(err)
      res.status(400).json({ err: err });
    });
};
