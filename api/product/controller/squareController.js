const Product = require("../model/Product");
const fetch = require("node-fetch");
const btoa = require("btoa");

const { ApiError, Client, Environment } = require("square");
const squareAccessToken =
  "EAAAEBSJ3NrqK4f9Lx8rGKRWfE1vWh6OT3PyGc2N9Oe9cMfUWtETCpkInSzs-MfS";
const { v4: uuidv4 } = require("uuid");
const { object } = require("@apimatic/schema");
const { response } = require("express");
const { identity, forEach } = require("lodash");

// Create an instance of the API Client
// and initialize it with the credentials
// for the Square account whose assets you want to manage
const client = new Client({
  timeout: 3000,
  environment: Environment.Production,
  accessToken: squareAccessToken,
});

//const { catalogApi } = client;

// const getLocations = async () => {
//   const locations = new Set();
//   try {
//     const response = await client.locationsApi.listLocations();
//     //console.log(response.result);

//     const arr = response.result.locations;
//     for (const x of arr) {
//       const i = { name: x.name, id: x.id };
//       locations.add(i);
//     }
//   } catch (error) {
//     console.log(error);
//   }

//   for (const a of locations) {
//     console.log("a :>> ", a);
//   }
// };

const lunchOrDinner = async (req, res) => {
  try {
    let lunch = "Square:fbcde3f6-0b5c-4d92-9806-cff56d6b2ae8";
    let dinner = "Square:136cde17-5585-4b76-92e8-235a40422ed0";
    let lunchArr = [];
    let dinnerArr = [];

    const response = await client.catalogApi.searchCatalogItems({
      enabledLocationIds: ["L7HDYY0GM38YB"],
    });
    let arr = response.result;

    for (const x of arr.items) {
      if (x.customAttributeValues) {
        temp = x.customAttributeValues;
        if (temp.hasOwnProperty(lunch)) {
          lunchArr.push(x);
        } else if (temp.hasOwnProperty(dinner)) {
          dinnerArr.push(x);
        }
      }
    }

    console.log("lunchArr :>> ", lunchArr);
    console.log("dinnerArr :>> ", dinnerArr);
  } catch (error) {
    console.log(error);
  }
};

// lunchOrDinner();

exports.getItems = async (req, res) => {
  let item = {
    name: "",
    description: "",
    price: "",
    category: "",
    stringValue: "",
  };
  let temp;
  let bodyData = {};
  try {
    const response = await client.catalogApi.searchCatalogItems({
      enabledLocationIds: ["L7HDYY0GM38YB"],
    });
    //console.log('response :>> ', response);
    let arr = response.result;
    let i = 0;
    let mezze = "Square:da546aeb-1751-4743-a769-d15f066bc776";
    let wraps = "Square:ec45cb4f-8fd6-4ce5-8647-03f8da61201b";
    let mezzeArr = [];
    let wrapsArr = [];
    for (const x of arr.items) {
      if (x.customAttributeValues) {
        temp = x.customAttributeValues;
        if (temp.hasOwnProperty(mezze)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[mezze].name;
          item["stringValue"] = temp[mezze].stringValue;
          mezzeArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
          };
        } else if (temp.hasOwnProperty(wraps)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[wraps].name;
          item["stringValue"] = temp[wraps].stringValue;
          wrapsArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
          };
        }
      }
    }
    // console.log('mezzeArr', mezzeArr)
    // console.log('wrapsArr', wrapsArr)
    let newMezze = mezzeArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    let newWraps = wrapsArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    bodyData = {
      mezze: newMezze,
      wraps: newWraps,
    };
    res.send(bodyData);
  } catch (error) {
    console.log("error is: ", error);
  }
};

const getCategories = async () => {
  const mySet = new Set();

  try {
    const response = await client.catalogApi.listCatalog(undefined, "CATEGORY");
    //console.log('response.result :>> ', response.result);

    const arr = response.result;
    //console.log('arr :>> ', arr);
    for (const x of arr.objects) {
      const i = { name: x.categoryData.name, id: x.id };
      mySet.add(i);
    }
  } catch (error) {
    console.log(error);
  }
  for (const a of mySet) {
    console.log(a);
  }
};

const getItems1 = async (req, res) => {
  let item = {
    name: "",
    description: "",
    price: "",
    category: "",
    stringValue: "",
  };
  let temp;
  try {
    const response = await client.catalogApi.searchCatalogItems({
      enabledLocationIds: ["LJB9D5PM4AWEM"],
    });
    //console.log('response :>> ', response);
    let arr = response.result;
    let mezze = "Square:da546aeb-1751-4743-a769-d15f066bc776";
    let wraps = "Square:ec45cb4f-8fd6-4ce5-8647-03f8da61201b";
    let sides = "Square:5e28d8d9-f305-4d85-9476-30cb4ec79b0e";
    let drinks = "Square:967e434f-96c5-4f67-a0da-443ac6df26a1";
    let sweets = "Square:a317554f-a4d9-4de0-a151-90c18dca7c71";

    let mezzeArr = [];
    let wrapsArr = [];
    let sidesArr = [];
    let drinksArr = [];
    let sweetsArr = [];

    for (const x of arr.items) {
      if (x.customAttributeValues) {
        temp = x.customAttributeValues;
        // console.log(temp)
        if (temp.hasOwnProperty(mezze)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[mezze].name;
          item["stringValue"] = temp[mezze].stringValue;
          mezzeArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
          };
        } else if (temp.hasOwnProperty(wraps)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[wraps].name;
          item["stringValue"] = temp[wraps].stringValue;
          wrapsArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
          };
        } else if (temp.hasOwnProperty(sides)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[sides].name;
          item["stringValue"] = temp[sides].stringValue;
          sidesArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
          };
        } else if (temp.hasOwnProperty(drinks)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[drinks].name;
          item["stringValue"] = temp[drinks].stringValue;
          drinksArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
          };
        } else if (temp.hasOwnProperty(sweets)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[sweets].name;
          item["stringValue"] = temp[sweets].stringValue;
          sweetsArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
          };
        }
      }
    }

    body = {
      sides: sidesArr,
      mezze: mezzeArr,
      drinks: drinksArr,
      sweets: sweetsArr,
      wraps: wrapsArr,
    };

    let newSides = sidesArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    let newMezze = mezzeArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    let newDrinks = drinksArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    let newSweets = sweetsArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    let newWraps = wrapsArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );

    body.sides = newSides;
    body.mezze = newMezze;
    body.drinks = newDrinks;
    body.sweets = newSweets;
    body.wraps = newWraps;

    console.log("body: ", body);
  } catch (error) {
    console.log("error is: ", error);
  }
};

//getItems1();

const getHanoonItems = async (req, res) => {
  let item = {
    name: "",
    description: "",
    price: "",
    category: "",
    stringValue: "",
    tag: "",
    health: "",
  };
  let temp;
  try {
    const response = await client.catalogApi.searchCatalogItems({
      enabledLocationIds: ["LJB9D5PM4AWEM"],
    });
    //console.log('response :>> ', response);
    let arr = response.result;
    let mezze = "Square:da546aeb-1751-4743-a769-d15f066bc776";
    let wraps = "Square:ec45cb4f-8fd6-4ce5-8647-03f8da61201b";
    let sides = "Square:5e28d8d9-f305-4d85-9476-30cb4ec79b0e";
    let drinks = "Square:967e434f-96c5-4f67-a0da-443ac6df26a1";
    let sweets = "Square:a317554f-a4d9-4de0-a151-90c18dca7c71";

    let mezzeArr = [];
    let wrapsArr = [];
    let sidesArr = [];
    let drinksArr = [];
    let sweetsArr = [];

    for (const x of arr.items) {
      if (x.customAttributeValues) {
        temp = x.customAttributeValues;
        // console.log(temp)
        if (temp.hasOwnProperty(mezze)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[mezze].name;
          item["stringValue"] = temp[mezze].stringValue;
          mezzeArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
            tag: "",
            health: "",
          };
        } else if (temp.hasOwnProperty(wraps)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[wraps].name;
          item["stringValue"] = temp[wraps].stringValue;
          wrapsArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
            tag: "",
            health: "",
          };
        } else if (temp.hasOwnProperty(sides)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[sides].name;
          item["stringValue"] = temp[sides].stringValue;
          sidesArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
            tag: "",
            health: "",
          };
        } else if (temp.hasOwnProperty(drinks)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[drinks].name;
          item["stringValue"] = temp[drinks].stringValue;
          drinksArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
            tag: "",
            health: "",
          };
        } else if (temp.hasOwnProperty(sweets)) {
          item["name"] = x.itemData.name;
          item["description"] = x.itemData.description;
          item["price"] = Number(
            x.itemData.variations[0]["itemVariationData"].priceMoney.amount
          );
          item["category"] = temp[sweets].name;
          item["stringValue"] = temp[sweets].stringValue;
          sweetsArr.push(item);
          item = {
            name: "",
            description: "",
            price: "",
            category: "",
            tag: "",
            health: "",
          };
        }
      }
    }

    body = {
      sides: sidesArr,
      mezze: mezzeArr,
      drinks: drinksArr,
      sweets: sweetsArr,
      wraps: wrapsArr,
    };

    let newSides = sidesArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    let newMezze = mezzeArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    let newDrinks = drinksArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    let newSweets = sweetsArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );
    let newWraps = wrapsArr.sort((a, b) =>
      a.stringValue > b.stringValue ? 1 : -1
    );

    body.sides = newSides;
    body.mezze = newMezze;
    body.drinks = newDrinks;
    body.sweets = newSweets;
    body.wraps = newWraps;

    return body;
  } catch (error) {
    console.log("error is: ", error);
  }
};

exports.hanoonItems = async (req, res) => {
  try {
    const body = await getHanoonItems();
    console.log(body);
    for (const x of body.mezze) {
      if (x.name === "hummus" || x.name === "baba ganoush") {
        x.tag = " - served with arabic bread";
        x.health = " (vegan, gf)";
      } else if (x.name === "muhammara") {
        x.tag = " - served with arabic bread";
        x.health = " (vegan)";
      } else if (x.name === "labneh") {
        x.tag = " - served with arabic bread";
        x.health = " (veg, gf)";
      } else if (x.name === "shorabat adas" || x.name === "marinated olives") {
        x.health = " (vegan)";
      }
    }

    for (const x of body.wraps) {
      if (x.name === "chicken shawarma") {
        x.tag = " - as a salad +$3";
        x.health = " (halal)";
      } else if (x.name === "za'atar") {
        x.tag = " - add shawarma chicken (halal) $6";
        x.health = " (veg)";
      } else if (x.name === "lahm bi ajine") {
        x.tag = " - add halloumi $4";
        x.health = " (halal)";
      } else if (x.name === "mamnoon falafel") {
        x.tag = " - as a salad +$3";
        x.health = " (veg)";
      } else if (x.name === "jibneh wi za'atar") {
        x.health = " (veg)";
      } else if (x.name === "za'atar") {
        x.health = " (veg)";
        x.tag = " - add shawarma chicken (halal) $6";
      }
    }

    for (const x of body.sides) {
      if (x.name === "harra frites") {
        x.health = " (veg)";
      } else if (x.name === "side shawarma") {
        x.name = "shawarma chicken";
        x.health = " (halal, gf)";
      } else if (x.name === "halloumi") {
        x.health = " - 5 pieces (veg, gf)";
      } else if (x.name === "side falafel") {
        x.name = "falafel";
        x.health = " - 4 pieces (veg)";
      } else if (x.name === "HARRA SAUCE (to-go)") {
        x.name = "harra sauce";
        x.health = " (vegan, gf)";
      }
    }

    for (const x of body.drinks) {
      if (x.name === "tarragon limeade (dining)") {
        x.name = "tarragon limeade";
      } else if (x.name === "mint lemonade (dining)") {
        x.name = "mint lemonade";
      } else if (x.name === "Soda (to-go)") {
        x.name = "soda";
      } else if (x.name === "Double Espresso (to-go)") {
        x.name = "double espresso";
      } else if (x.name === "Double Turkish Espresso (to-go)") {
        x.name = "double turkish espresso";
      } else if (x.name === "San Pellegrino - TO GO") {
        x.name = "san pellegrino";
      }
    }

    for (const x of body.sweets) {
      if (x.name === "Mama's Cookies (to go)") {
        x.name = "mama's cookies";
        x.health = " - 3 pieces (veg)";
      }
    }

    res.send(body);
  } catch (error) {
    console.error(error);
  }
};

// hanoonItems();

const squareItems = async (req, res) => {
  let item = {
    name: "",
    description: "",
    price: "",
    category: "",
    dietaryInfo: "",
    addOns: "",
    publishToGuestMenu: false,
    timeStamp: "",
    uid: "",
    dayPart: "",
    restaurantName: "",
  };

  let temp;

  // Square Custom Attributes IDs
  let category = "Square:34484653-a2a4-44d5-b8f9-82cf2a22b0d8";
  let addOns = "Square:1ee10526-008a-47be-800c-9122920bf522";
  let dayPart = "Square:95bb4b57-983a-47d6-92c4-6501e0baa506";
  let publishedToMenu = "Square:bcf511a3-73e6-47ae-8c4e-f9949b75eb09";
  let dietaryInfo = "Square:d4189e46-73f9-4b37-9703-5e0239338e5c";

  let plasmicItems = [];

  // Category selection IDs
  let bowls = "IDD2JOQVD6W636ZEBOROODUO";
  let drinks = "U2SXOWYUV3KAM74VNGOSUFUS";
  let entree = "3VF4LNY243V7XWFGPFN5RMDO";
  let grill = "26M2TNF5D4G6LVPL4TYLZBE3";
  let mezze = "BQYRCSX32PUVNTPZDUTB5BO7";
  let salad = "LZEURMHBGVJAKTV3TQVR57NJ";
  let sandwiches = "CKNOR6OY7AXIC4VXWQMQQZ5V";
  let sides = "AOGJNTWFVLFEBRIC5LQ6G7PC";
  let soups = "ZJEO4QZHVK2GUYWPKQ4263M4";
  let sweets = "EL37KOM6LCDH64LRSG4VP4Z3";
  let wraps = "EEFB5Q2ZJJRYZXKSDATQVLM2";

  // Add Ons IDs
  let addHalloumi = "POJMRAKKENYMDG3OYXQAIBJS";
  let addShawarma = "VZ4LVJOJYAM767CDAAJWN7VA";
  let asSalad = "6YRWAHLBHUKQ4MKIOYYWRBHA";
  let servedWithPita = "WY35I7V2VCXTQVWYLVLLCINM";

  // Day Part IDs
  let allDay = "ZTE3WHCILRO5PGS4PNCTNYSD";
  let lunch = "Z3BP3RPM6B5BTIRIKTWEH6LO";
  let dinner = "HWJQYF3TMPM7V5ZESGT3HR4N";
  let happyHour = "SIH2JZTDDPOA3DRU2FDD6HE6";
  let window = "343XPD2IZZ5FIPDNU2N5666U";

  // Dietary Info IDs
  let dairyFree = "CCXC2LGSGONRBPGKIHE2ZCWD";
  let glutenFree = "WOW54WV2BNLIVI6LKY6Y7XW4";
  let halal = "OKJS46VVOLPMC66PRX2SCPNI";
  let vegan = "KT74VBO4JOS4RDT3D4DRRMRW";
  let vegetarian = "457EJPKY6UUKEE2NLSQ4OJAK";

  try {
    const response = await client.catalogApi.searchCatalogItems({
      enabledLocationIds: ["LJB9D5PM4AWEM"],
    });

    let arr = response.result;

    for (const x of arr.items) {
      if (x.customAttributeValues) {
        temp = x.customAttributeValues;
       // console.log('temp :>> ', temp)
        item["name"] = x.itemData.name;
        item["description"] = x.itemData.description;
        item["price"] = Number(
          x.itemData.variations[0]["itemVariationData"].priceMoney.amount
        );
        item["restaurantName"] = "hanoon";
        item["timeStamp"] = x.updatedAt;
        item["uid"] = x.id;

        // Add new category to item
        if(temp.hasOwnProperty(category)){
          for(const cat of temp[category].selectionUidValues){
            if(cat === bowls){
              item['category'] = "bowls";
            } else if(cat === drinks){
              item['category'] = "drinks";
            } else if(cat === entree){
              item['category'] = "entree";
            } else if(cat === grill){
              item['category'] = "grill";
            } else if(cat === mezze){
              item['category'] = "mezze";
            } else if(cat === salad){
              item['category'] = "salad";
            } else if(cat === sandwiches){
              item['category'] = "sandwiches";
            } else if(cat === sides){
              item['category'] = "sides";
            } else if(cat === soups){
              item['category'] = "soup";
            } else if(cat === sweets){
              item['category'] = "sweets";
            } else if(cat === wraps){
              item['category'] = "wraps";
            }
          }
        }
        // Add addOns to item
        if(temp.hasOwnProperty(addOns)){
          for(const add of temp[addOns].selectionUidValues){
            if(add === addHalloumi){
              item['addOns'] += " - add halloumi +$4";
            } else if(add === addShawarma){
              item['addOns'] += " - add chicken shawarma (halal) +$6";
            } else if(add === asSalad){
              item['addOns'] += " - as a salad +$3";
            } else if(add === servedWithPita){
              item['addOns']+= " - served with arabic bread";
            }
          }
        }

        if(temp.hasOwnProperty(dayPart)){
          for(const hours of temp[dayPart].selectionUidValues){
            if(hours === allDay){
              item['dayPart'] = "all day";
            } else if(hours === lunch){
              item['dayPart'] = "lunch";
            } else if(hours === dinner){
              item['dayPart'] = "dinner";
            } else if(hours === happyHour){
              item['dayPart'] = "happy hour";
            } else if(hours === window){
              item['dayPart'] = "window";
            }
          }
        }

        if(temp.hasOwnProperty(dietaryInfo)){
          for(const dietInfo of temp[dietaryInfo].selectionUidValues){
            if(dietInfo === dairyFree){
              item['dietaryInfo'] += "df ";
            } else if(dietInfo === glutenFree){
              item['dietaryInfo'] += "gf ";
            } else if(dietInfo === halal){
              item['dietaryInfo'] += "hal ";
            } else if(dietInfo === vegan){
              item['dietaryInfo'] += "veg ";
            } else if(dietInfo === vegetarian){
              item['dietaryInfo'] += "v "
            }
          }
        }

        if(temp.hasOwnProperty(publishedToMenu)){
          if(temp[publishedToMenu].booleanValue === true){
            item['publishToGuestMenu'] = true;
            plasmicItems.push(item);
          }
        }
        item = {
          name: "",
          description: "",
          price: "",
          category: "",
          dietaryInfo: "",
          addOns: [],
          publishToGuestMenu: false,
          timeStamp: "",
          uid: "",
          dayPart: "",
          restaurantName: "",
        };
      }
    }
    for(const i of plasmicItems){
      console.log('i is :>> ', i);
    }
  } catch (error) {
    console.log("error is: ", error);
  }
};

squareItems();
