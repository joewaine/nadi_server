const Product = require("../model/Product");
const RetailProduct = require("../model/RetailProduct");
const fetch = require("node-fetch");
const axios = require("axios");
const cron = require("node-cron");
// const { delete } = require("../route/product");

let newRetailItem = async (req) => {
  // console.log('new retail item')
  try {
    var conditions = {
      "menu.id": { $ne: req.id },
    };
    var update = {
      $addToSet: { menu: req },
    };
    // console.log(req)
    await RetailProduct.findOneAndUpdate(
      conditions,
      update,
      function (err, doc) {
        // console.log('updates')
        // console.log(doc)
      }
    );
  } catch (err) {
    console.log(err);
  }
};

let addMenuData = async (req, nameString, retail) => {
  try {
    if (retail) {
      for (i in req) {
        newRetailItem(req[i]);
      }

      // console.log('go check mongo')
      // await RetailProduct.findOneAndUpdate(
      //   { "name": nameString },
      //   {
      //       "$set": {
      //         "menu": req
      //       }
      //   },
      //   {
      //     upsert: true
      //   }
      //   );
      updateAll();
    } else {
      await Product.findOneAndUpdate(
        { name: nameString },
        {
          $set: {
            menu: req,
          },
        },
        {
          upsert: true,
        }
      );
      updateAll();
    }
  } catch (err) {}
};

exports.upserveMongo = async (req, res) => {
  try {
    if (req.params.name === "mamnoonretail") {
      let doc = await RetailProduct.find({ name: req.params.name });
      res.status(201).json({ doc });
    } else {
      let doc = await Product.find({ name: req.params.name });
      res.status(201).json({ doc });
    }
  } catch (err) {
    console.log("fail");
  }
};

exports.mamnoonItemsPullMenu = async (req, res) => {
  // console.log('mamnoon pull menu')

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
      // console.log(body)
      res.status(201).json({ body });

      addMenuData(body, "mamnoon");

      // upserveMongo('mamnoon')
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

let mamnoonItemsPullMenuInit = async () => {
  // console.log('mamnoon pull menu')

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
      // console.log(body)
      // res.status(201).json({ body });

      addMenuData(body, "mamnoon");

      // upserveMongo('mamnoon')
    }
  } catch (err) {
    //  res.status(400).json({ err: err });
    console.log("error");
  }
};

// pull menu from OLO
// pull menu from OLO
// pull menu from OLO
// pull menu from OLO



//pull items streeet

exports.mamnoonItemsPullMenuStreet = async () => {
  // console.log('mamnoon street pull menu')

  try {
    const request = await fetch(
      "https://hq.breadcrumb.com/ws/v1/menus/online_ordering/",
      {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
          "X-Breadcrumb-Password": "TJzwaP8uguyy",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      }
    );
    if (request.ok) {
      const body = await request.json();
      // console.log(body)
      // res.status(201).json({ body });
      // console.log('success')
      addMenuData(body, "mamnoonstreet");
      // upserveMongo('mamnoonstreet')
    }
  } catch (err) {
    //  res.status(400).json({ err: err });
  }
};

let mamnoonItemsPullMenuStreetInit = async () => {
  // console.log('mamnoon street pull menu')

  try {
    const request = await fetch(
      "https://hq.breadcrumb.com/ws/v1/menus/online_ordering/",
      {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
          "X-Breadcrumb-Password": "TJzwaP8uguyy",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      }
    );
    if (request.ok) {
      const body = await request.json();
      // console.log(body)
      // res.status(201).json({ body });
      // console.log('success')l
      addMenuData(body, "mamnoonstreet");
    }
  } catch (err) {
    //  res.status(400).json({ err: err });
  }
};

//pull items street
// post an online order
// post an online order
// post an online order
// post an online order
// post an online order

exports.postOnlineOrder = async (req, res) => {
  console.log(1);

  console.log(345);

  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
        "X-Breadcrumb-Password": "uQM8mseTvnTX",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });
};

exports.streetItems = async (req, res) => {
  const secret = "{}";
  try {
    const request = await fetch("{}", {
      headers: {
        "": ``,
        "": "",
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

let updateAll = async () => {
  // console.log('update all')
  // try{
  // // console.log('update all')
  // await RetailProduct.updateMany(
  // {}
  // , {
  // '$set': {
  // "menu.$[].lbs": 0,
  // "menu.$[].oz": 0,
  // "menu.$[].shippable": false,
  // "menu.$[].visible": false,
  // "menu.$[].height": 0,
  // "menu.$[].width": 0,
  // "menu.$[].length": 0,
  // "menu.$[].girth": 0
  // }
  // },{ multi: true });
  // }catch (err) {
  // console.log(err)
  // }
};

// updateAll()

exports.shippableEdit = async (req, res) => {
  console.log("shippableEdit");

  try {
    // let doc = await RetailProduct.find()
    // console.log(doc)

    console.log("update one");
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      {
        $set: {
          "menu.$.shippable": req.body.tf,
        },
      },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

exports.updateRetailItemLbs = async (req, res) => {
  // console.log('updateRetailItemLbs')

  try {
    // console.log('update one')
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      {
        $set: {
          "menu.$.lbs": req.body.number,
        },
      },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

exports.updateRetailItemOz = async (req, res) => {
  // console.log('updateRetailItemOz')

  try {
    // console.log('update one')
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      {
        $set: {
          "menu.$.oz": req.body.number,
        },
      },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

exports.updateRetailItemHeight = async (req, res) => {
  console.log("updateRetailItemHeight");

  try {
    console.log("update one");
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      {
        $set: {
          "menu.$.height": req.body.number,
        },
      },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

exports.updateRetailItemWidth = async (req, res) => {
  console.log("updateRetailItemWidth");

  try {
    console.log("update one");
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      {
        $set: {
          "menu.$.width": req.body.number,
        },
      },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

exports.updateRetailItemLength = async (req, res) => {
  console.log("updateRetailItemLength");

  try {
    console.log("update one");
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      {
        $set: {
          "menu.$.length": req.body.number,
        },
      },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

exports.updateRetailItemGirth = async (req, res) => {
  console.log("updateRetailItemgirth");

  try {
    console.log("update one");
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      {
        $set: {
          "menu.$.girth": req.body.number,
        },
      },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

exports.deleteItem = async (req, res) => {
  // console.log('visibleEdit')
  console.log(req.body);

  try {
    console.log("update one");

    await RetailProduct.updateOne(
      { name: "mamnoonretail" },
      { $pull: { menu: { id: req.body.id } } },
      { safe: true },
      function removeConnectionsCB(err, obj) {
        console.log(err, obj);

        res.status(200).json({ obj });
      }
    );
  } catch (err) {
    console.log(err);
    res.send("error");
    res.status(400).json({ err: err });
  }
};

exports.visibleEdit = async (req, res) => {
  console.log("visibleEdit");

  try {
    console.log("update one");
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      {
        $set: {
          "menu.$.visible": req.body.tf,
        },
      },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

// router.get('/upserveolo', upserveController.mamnoonItemsPullMenu);
// router.get('/upserveolostreet', upserveController.mamnoonItemsPullMenuStreet);


cron.schedule("*/30 * * * * *", () => {
  // checkCheckStatus()
  // checkCheckStatusStreet()
  // placeScheduledOrders()

  // if(process.env.LOCAL_ENVIRONMENT === ''){
  mamnoonItemsPullMenuStreetInit();
  mamnoonItemsPullMenuInit();
  // }


  
});

exports.upserveMongoRetail = async (req, res) => {
  console.log(req.body);
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

      let retail = body.sections.filter(function (x) {
        if (x.name === "Spices" || x.name === "Retail") {
          return x.item_ids;
        }
      });

      console.log("retail log");
      console.log(retail);

      let betterArray = [];

      retail.forEach(function (x) {
        betterArray.push(
          x.item_ids.map(function (y) {
            return {
              category: x.name,
              id: y,
            };
          })
        );
      });

      let betterArrayFlat = betterArray.flat();

      let retailObjects = body.items.filter(function (x) {
        if (
          retail
            .map((x) => x.item_ids)
            .flat()
            .includes(x.id)
        ) {
          return x;
        }
      });

      let withCategory = retailObjects.map(function (x, i) {
        x.category = betterArrayFlat[i].category;
        return x;
      });

      addMenuData(withCategory, "mamnoonretail", true);

      res.status(201).json({ withCategory });
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.menuMamnoon = async (req, res) => {
  console.log("you hit this");
  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/items.json?status=active&limit=500`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-llc`,
          "X-Breadcrumb-Password": "sbkh_Qgs4HMB",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      console.log(13);
      let body = await request.json();
      console.log(body);
      // console.log(body);
      // res.send(201).json({body});
      res.status(201).json({ body });
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
};

exports.menuMamnoonCategories = async (req, res) => {
  console.log("you hit this");
  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/categories.json`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-llc`,
          "X-Breadcrumb-Password": "sbkh_Qgs4HMB",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      console.log(13);
      let body = await request.json();
      console.log(body);
      // console.log(body);
      // res.send(201).json({body});
      res.status(201).json({ body });
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
};



exports.menuMamnoonStreet = async (req, res) => {
  console.log("you hit this");
  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/items.json?status=active&limit=500`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-street`,
          "X-Breadcrumb-Password": "H227s3CADgg4",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      console.log(13);
      let body = await request.json();
      // console.log(body);
      // console.log(body);
      // res.send(201).json({body});
      res.status(201).json({ body });
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
};

exports.menuMamnoonStreetCategories = async (req, res) => {
  console.log("you hit this");
  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/categories.json`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-street`,
          "X-Breadcrumb-Password": "H227s3CADgg4",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      console.log(13);
      let body = await request.json();
      console.log(body);
      // console.log(body);
      // res.send(201).json({body});
      res.status(201).json({ body });
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
};

// router.get('/menumamnoon', upserveController.menuMamnoon);

// router.get('/mamnoonstreet', upserveController.menuMamnoonStreet);
