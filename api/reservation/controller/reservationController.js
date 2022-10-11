const Reservation = require("../model/Reservation");
const fetch = require("node-fetch");
const btoa = require("btoa");
const axios = require("axios");
const e = require("express");
const moment = require("moment");
var sdk = require("emergepay-sdk");
const cron = require("node-cron");

exports.retrieve = async (req, res) => {
  try {
    const packs = await Reservation.find({});
    // console.log('retrieval hide')
    res.status(200).json({ packs });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

// let deleteAll = async (req, res) => {
//     try {
//       const packs = await Reservation.deleteMany({})
//   // console.log('retrieval hide')
//     // res.status(200).json({ packs });
//     console.log(packs);
//     } catch (err) {
//     //  res.status(400).json({ err: err });
//    }
//   }

// deleteAll();

exports.retrieveByEmail = async (req, res) => {
  try {
    const reservations = await Reservation.find({ email: req.params.email });
    // console.log('retrieval hide')
    res.status(200).json({ reservations });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.retrieveByEmailMamnoon = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      email: req.params.email,
      "reservationsList.roomsinfo.allInfo.venue_id":
        "ahNzfnNldmVucm9vbXMtc2VjdXJlchwLEg9uaWdodGxvb3BfVmVudWUYgICoqvD3lAoM",
    });
    // console.log('retrieval hide')
    res.status(200).json({ reservations });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

let retrieveReservations = async function () {


  try {
    // const pq = await Reservation.find({'date': "2019-10-29"});

    const pq = await Reservation.find({
      email: "wassef@mamnoonrestaurant.com",
      "reservationsList.roomsinfo.allInfo.venue_id":
        "ahNzfnNldmVucm9vbXMtc2VjdXJlchwLEg9uaWdodGxvb3BfVmVudWUYgICoqvD3lAoM",
    });

    // joe@mamnoonrestaurant.com
    // const pq = await Reservation.find({ "email": { "$regex": "joe@mamnoonrestaurant.com", "$options": "i" } });
    // shobitb@gmail.com
    // const pq = await Reservation.find({'email': 'sofien@mamnoonrestaurant.com'});
  } catch (err) {
    //  res.status(400).json({ err: err });
  }
};

retrieveReservations();

let additions = 0;

let addReservationToMongo = async function (item) {
  /// insertddd
  ///d
  ///d
  ///d
  try {
    // var query = {upserveId: item.upserveId},

    // update = { new Reservation(item) },

    var query = { sevenRoomsId: item.sevenRoomsId },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    Reservation.findOneAndUpdate(
      query,
      item,
      options,
      function (error, result) {
        if (error) return;
        // console.log('success add reservation from con');
        console.log(result.date);
        console.log(result.email);
        // do something with the document
        additions++;
        console.log(additions + " new item added");
        console.log(additions + " new item added");
      }
    );
  } catch (err) {
    res.status(400).json({ err: err });
    console.log("error");
  }
  ///d
  ///d
  ///d
  ///d
  ///d
  // try {

  //     const reservation = new Reservation(item)

  //     let data =  await reservation.save();
  //     console.log('reservation saved');
  //     // res.status(200).json({ data });
  //     console.log(data);
  //     console.log('success add reservation from con');
  //   } catch (err) {
  //     res.status(400).json({ err: err });
  //     console.log('error');
  //   }
};

let sevenRoomsToken;

let getSevenRoomsToken = async function () {
  axios
    .post("https://api.sevenrooms.com/2_4/auth", null, {
      params: {
        client_id: `352a44099079735ee3776dc79f203a85bfecc3854ca20a4981d33a7810e592f790d1a9c562aa737ed6517179382a845a8a3081c0b5eff7a4e44b58d897f8bd7a`,
        client_secret:
          "9649ff70cfa0bcc9e370c3954e2d5b1eb118977d2c8435128f04590aec8ec755e1921ecf5e7492d220076c4cb3770ad2fbfda08c3e72a87a08b74615437ab760",
      },
    })
    .then(function (response) {
      sevenRoomsToken = response.data.data.token;
      // console.log('sevenRoomsToken');
      // console.log(sevenRoomsToken);
    })
    .catch(function (error) {
      console.log(error);
    });
};

getSevenRoomsToken();

// add to database
// add to database
// add to database
// add to database
// add to database
// add to database
// add to database
// add to database

cron.schedule("0 0 */3 * * *", () => {
  console.log("additions");

  var now = new Date();
  var daysOfYear = [];
  var d = new Date();

  for (d.setDate(d.getDate() - 2); d <= now; d.setDate(d.getDate() + 1)) {
    daysOfYear.push(moment(new Date(d)).format("YYYYMMDD"));
  }

  function doTimeOutAddition(insertion) {
    //  console.log('done1');
    setTimeout(function () {
      dateOverlapIn(insertion);
    }, 1000);
  }

  setTimeout(function () {
    for (let i in daysOfYear) {
      doTimeOutAddition(daysOfYear[i]);
    }
  }, 1000);
});

cron.schedule("0 0 */3 * * *", () => {
  console.log("additions");

  var now = new Date();
  var daysOfYear = [];
  var d = new Date();

  for (d.setDate(d.getDate() - 2); d <= now; d.setDate(d.getDate() + 1)) {
    daysOfYear.push(moment(new Date(d)).format("YYYYMMDD"));
  }

  function doTimeOutAddition(insertion) {
    //  console.log('done1');
    setTimeout(function () {
      dateOverlapInMamnoon(insertion);
    }, 1000);
  }

  setTimeout(function () {
    for (let i in daysOfYear) {
      doTimeOutAddition(daysOfYear[i]);
    }
  }, 1000);
});

// add to database
// add to database
// add to database
// add to database
// add to database
// add to database
// add to database
// add to database

let dateOverlapIn = async function (dateInput) {
  let date = dateInput;

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

          if (x.last_name !== null) {
            return {
              sevenrooms: lc.toLowerCase(),
              roomsinfo: {
                phone: x.phone_number,
                last: x.last_name,
                email: x.email,
                allInfo: x,
              },
            };
          }
        })
        .filter((x) => x !== undefined);

      let reservationsList = reservations;

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
            if (emparr.length > 0) {
              for (j in emparr) {
                if (emparr[j].upserveInfo.cc_name !== null) {
                  let n = emparr[j].upserveInfo.cc_name.split(" ");
                  if (
                    n[n.length - 1].toLowerCase() ===
                    reservationsList[i].sevenrooms
                  ) {
                    builtArr.push({
                      email: reservationsList[i].roomsinfo.allInfo.email,
                      date: reservationsList[i].roomsinfo.allInfo.date,
                      emailDate:
                        reservationsList[i].roomsinfo.allInfo.email +
                        reservationsList[i].roomsinfo.allInfo.date,
                      venue: "mbar",
                      upserveId: emparr[j].upserveInfo.id,
                      sevenRoomsId: reservationsList[i].roomsinfo.allInfo.id,
                      reservationsList: reservationsList[i],
                      upserveInfo: emparr[j],
                    });
                  }
                } else {
                  builtArr.push({
                    email: reservationsList[i].roomsinfo.allInfo.email,
                    date: reservationsList[i].roomsinfo.allInfo.date,
                    emailDate:
                      reservationsList[i].roomsinfo.allInfo.email +
                      reservationsList[i].roomsinfo.allInfo.date,
                    venue: "mbar",
                    upserveId: {},
                    sevenRoomsId: reservationsList[i].roomsinfo.allInfo.id,
                    reservationsList: reservationsList[i],
                    upserveInfo: {},
                  });
                }
              }
            }
          }

          for (let i in builtArr) {
            addReservationToMongo(builtArr[i]);
          }
        }
      } catch (err) {
        console.log(err);
        console.log("failure");
      }
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
};

exports.dateOverlap = async (req, res) => {
  let date = req.query.date;

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
          if (x.last_name !== null) {
            return {
              sevenrooms: lc.toLowerCase(),
              roomsinfo: {
                phone: x.phone_number,
                last: x.last_name,
                email: x.email,
                allInfo: x,
              },
            };
          }
        })
        .filter((x) => x !== undefined);

      let reservationsList = reservations;

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
            if (emparr.length == 0) {
              builtArr.push({
                email: reservationsList[i].roomsinfo.allInfo.email,
                date: reservationsList[i].roomsinfo.allInfo.date,
                emailDate:
                  reservationsList[i].roomsinfo.allInfo.email +
                  reservationsList[i].roomsinfo.allInfo.date,
                venue: "mbar",
                upserveId: {},
                sevenRoomsId: reservationsList[i].roomsinfo.allInfo.id,
                reservationsList: reservationsList[i],
                upserveInfo: {},
              });
            } else {
              for (j in emparr) {
                if (emparr[j].upserveInfo.cc_name !== null) {
                  let n = emparr[j].upserveInfo.cc_name.split(" ");
                  if (
                    n[n.length - 1].toLowerCase() ===
                    reservationsList[i].sevenrooms
                  ) {
                    builtArr.push({
                      email: reservationsList[i].roomsinfo.allInfo.email,
                      date: reservationsList[i].roomsinfo.allInfo.date,
                      emailDate:
                        reservationsList[i].roomsinfo.allInfo.email +
                        reservationsList[i].roomsinfo.allInfo.date,
                      venue: "mbar",
                      upserveId: emparr[j].upserveInfo.id,
                      sevenRoomsId: reservationsList[i].roomsinfo.allInfo.id,
                      reservationsList: reservationsList[i],
                      upserveInfo: emparr[j],
                    });
                  }
                }
              }
            }
          }

          // return builtArr
          res.send(builtArr);
          // console.log(builtArr)

          for (let i in builtArr) {
            addReservationToMongo(builtArr[i]);
          }
        }
      } catch (err) {
        console.log(err);
        console.log("failure");
      }
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
};

// exports.dateOverlapMamnoon = async (req, res) => {
let lengthofmamres = 0;
let dateOverlapInMamnoon = async function (dateInput) {
  let date = dateInput;
  // let date = req.query.date
  // console.log(dateInput);
  // let date = '20210330';

  try {
    let request = await fetch(
      `https://api.sevenrooms.com/2_4/reservations/export?venue_group_id=ahNzfnNldmVucm9vbXMtc2VjdXJlciELEhRuaWdodGxvb3BfVmVudWVHcm91cBiAgPC5uamvCAw&limit=400&from_date=${date}&to_date=${date}&venue_id=ahNzfnNldmVucm9vbXMtc2VjdXJlchwLEg9uaWdodGxvb3BfVmVudWUYgICoqvD3lAoM`,
      {
        headers: {
          // 'Authorization': `6e1e4fbc8f8ae60d6dd6c880ba793114250e8f5ac4f4644d1924afab217792a1affe30ec2e31b389e9dbbfcc8a88ec8518d497cdca3700004b161d39a84b7feb`
          Authorization: sevenRoomsToken,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();

      // console.log(body.data.results.length);
      reservations = body.data.results
        .map(function (x) {
          let lc = x.last_name;
          if (x.last_name !== null) {
            return {
              sevenrooms: lc.toLowerCase(),
              roomsinfo: {
                phone: x.phone_number,
                last: x.last_name,
                email: x.email,
                allInfo: x,
              },
            };
          }
        })
        .filter((x) => x !== undefined);

      // res.send({
      //   date: req.body.date,
      //   reservations: reservations
      // })
      // let date

      let reservationsList = reservations;

      try {
        let request = await fetch(
          `https://api.breadcrumb.com/ws/v2/checks.json?date=${date}`,
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
            if (emparr.length == 0) {
              builtArr.push({
                email: reservationsList[i].roomsinfo.allInfo.email,
                date: reservationsList[i].roomsinfo.allInfo.date,
                emailDate:
                  reservationsList[i].roomsinfo.allInfo.email +
                  reservationsList[i].roomsinfo.allInfo.date,
                venue: "mamnoon",
                upserveId: {},
                sevenRoomsId: reservationsList[i].roomsinfo.allInfo.id,
                reservationsList: reservationsList[i],
                upserveInfo: {},
              });
            } else {
              for (j in emparr) {
                if (emparr[j].upserveInfo.cc_name !== null) {
                  let n = emparr[j].upserveInfo.cc_name.split(" ");
                  if (
                    n[n.length - 1].toLowerCase() ===
                    reservationsList[i].sevenrooms
                  ) {
                    builtArr.push({
                      email: reservationsList[i].roomsinfo.allInfo.email,
                      date: reservationsList[i].roomsinfo.allInfo.date,
                      emailDate:
                        reservationsList[i].roomsinfo.allInfo.email +
                        reservationsList[i].roomsinfo.allInfo.date,
                      venue: "mamnoon",
                      upserveId: emparr[j].upserveInfo.id,
                      sevenRoomsId: reservationsList[i].roomsinfo.allInfo.id,
                      reservationsList: reservationsList[i],
                      upserveInfo: emparr[j],
                    });
                  }
                }
              }
            }
          }

          // return builtArr
          // res.send(builtArr)
          // console.log(builtArr)

          for (let i in builtArr) {
            // console.log(builtArr[i])
            addReservationToMongo(builtArr[i]);

            lengthofmamres++;
            // console.log(lengthofmamres);
          }
        }
      } catch (err) {
        console.log(err);
        console.log("failure");
      }
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
};

let mamnoonBcItems = async function () {
  try {
    let request = await fetch(`https://api.breadcrumb.com/ws/v2/items.json`, {
      headers: {
        "X-Breadcrumb-Username": `joe-waine_mamnoon-llc`,
        "X-Breadcrumb-Password": "sbkh_Qgs4HMB",
        "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
      },
    });
    if (request.ok) {
      let body = await request.json();

      // console.log(body);
    }
  } catch (err) {
    console.log(err);
    console.log("failure");
  }
};

// mamnoonBcItems();
