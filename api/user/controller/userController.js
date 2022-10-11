const axios = require("axios");
const User = require("../model/User");
const parseString = require("xml2js").parseString;

exports.registerNewUser = async (req, res) => {
  try {
    let isUser = await User.find({ email: req.body.email });
    // // console.log(isUser);
    if (isUser.length >= 1) {
      return res.status(409).json({
        message: "email already in use",
      });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    let data = await user.save();
    const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
    res.status(201).json({ data, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    // // console.log(res)
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getUserDetails = async (req, res) => {
  await res.json(req.userData);
};

//get testimonials

exports.getTestimonials = async (req, res) => {
  console.log(req.params.email);
  try {
    const user = await User.findByUserEmail(req.params.email);
    const usertestimonials = user.testimonials;
    console.log(usertestimonials);
    res.status(201).json({ usertestimonials });
  } catch {
    res.status(400).json({ err: err });
  }
};

exports.submitTestimonial = async (req, res) => {
  const testimonialInfo = {
    _id: String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now(),
    title: req.body.title,
    body: req.body.body,
    name: req.body.name,
  };

  try {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { $push: { testimonials: testimonialInfo } }
    );

    const user = await User.findByUserEmail(req.body.email);

    console.log(user);

    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

// submit testimonial

exports.addProduct = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { $push: { products: req.body.name } }
    );

    const user = await User.findByUserEmail(req.body.email);

    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const user = await User.findByUserId(req.params.id);
    // // console.log(user)
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    // const user = 'req params email'
    const user = await User.findByUserEmail(req.params.email);
    res.status(201).json({ user });
  } catch (err) {
    const user = new User({
      name: "new user",
      email: req.params.email,
      password: "password",
    });
    let data = await user.save();
    const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
    res.status(201).json({ data, token });
    //  res.status(400).json({ err: err });
  }
};


// this one
exports.lookUpGiftCard = async (req, res) => {



  // console.log("look up giftcard");
  // console.log(typeof(req.body.cardNumber));
  // console.log(req.body.cardNumber);



  // console.log("look up giftcard 123456");
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = mm + "/" + dd + "/" + yyyy;

  let currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });
  let currentTimeSliced = currentTime.replace(" ", "");

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
      res.status(201).json({ resSendData });
    })
    .catch((err) => {
      // // console.log(err)
      response.status(400).json({ err: err });
    });
};

exports.useGiftCard = async (req, res) => {
  console.log(req.body);
  console.log("use giftcard");
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = mm + "/" + dd + "/" + yyyy;

  let currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });
  let currentTimeSliced = currentTime.replace(" ", "");
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
    <SvUse>
    <CardNbr>
    ${req.body.cardNumber}
    </CardNbr>
    <Amount>${req.body.useAmount}</Amount>
    </SvUse>
    </Requests>
    </Trans>`;

  var config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  //  axios.post('http://test.portal.custcon.com/Partner/ProcessXml', xmlBodyStr, config).then(response => {

  axios
    .post("https://portal2.custcon.com/Partner/ProcessXml", xmlBodyStr, config)
    .then((response) => {
      let resData = response.data;
      let resSendData = null;

      parseString(resData, function (err, result) {
        resSendData = result["Trans"];
      });

      res.status(201).json({ resSendData });
    })
    .catch((err) => {
      response.status(400).json({ err: err });
    });
};

exports.deleteTestimonial = async (req, res) => {
  console.log(req.body);
  const testimonialDelete = await User.update(
    {},
    { $pull: { testimonials: { _id: req.body.testimonialId } } },
    { multi: true }
  );

  res.status(201).json({ testimonialDelete });
};
// </SvInquiry>
// giftcards

exports.getGiftcards = async (req, res) => {
  console.log(req.params.email);
  try {
    const user = await User.findByUserEmail(req.params.email);
    const usergiftcards = user.giftcards;
    console.log(usergiftcards);
    res.status(201).json({ usergiftcards });
  } catch {
    res.status(400).json({ err: err });
  }
};

exports.submitGiftcard = async (req, res) => {
  console.log('hit submitGiftCard in userController line 301')
  console.log(req.body);
  const giftcardInfo = {
    _id: String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now(),
    number: req.body.number,
    preferred: false,
  };
  try {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { $push: { giftcards: giftcardInfo } }
    );
    const user = await User.findByUserEmail(req.body.email);
    console.log(user);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByUserEmail(req.params.email);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.deleteGiftcard = async (req, res) => {
  console.log(req.body);
  const giftcardDelete = await User.update(
    {},
    { $pull: { giftcards: { _id: req.body.giftcardId } } },
    { multi: true }
  );
  res.status(201).json({ giftcardDelete });
};

exports.primaryGiftCard = async (req, res) => {
  try {
    // let doc = await Order.findById('5f97465eebb3b9108bc2a50b')

    let doc = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          giftcard: req.body.number,
        },
      },
      function (err, doc) {}
    );

    console.log("primary giftcard updated");
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

exports.submitDeliveryAddress = async (req, res) => {
  console.log(req.body);

  try {
    // let doc = await Order.findById('5f97465eebb3b9108bc2a50b')

    let doc = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          deliveryAddress: req.body.deliveryAddress,
        },
      },
      function (err, doc) {}
    );

    console.log("delivery address updated");
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

exports.submitBillingAddress = async (req, res) => {
  console.log(req.body);

  try {
    // let doc = await Order.findById('5f97465eebb3b9108bc2a50b')

    let doc = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          billingAddress: req.body.billingAddress,
        },
      },
      function (err, doc) {}
    );

    console.log("billing address updated");
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};





async function lookUpGiftCard(){



  console.log("look up giftcard");
  // console.log(typeof(req.body.cardNumber) / /);
  // console.log(req.body.cardNumber);
let cardNumber = '2104780246650418'


  console.log("look up giftcard 123456");
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = mm + "/" + dd + "/" + yyyy;

  let currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });
  let currentTimeSliced = currentTime.replace(" ", "");

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
  ${cardNumber}
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
      // res.status(201).json({ resSendData });
      console.log(resSendData.Responses[0].SvInquiry);
    })
    .catch((err) => {
      console.log(err)
      // response.status(400).json({ err: err });
    });
};


// lookUpGiftCard();