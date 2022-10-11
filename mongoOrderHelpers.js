const Order = require("./api/order/model/Order");

async function orderPostedTrue(idToClose) {
  console.log('do order posted true')
    try {
      await Order.updateOne(
        { upserveId: idToClose },
        { $set: { orderPosted: true } },
        { multi: true }
      );
    } catch (err) {
      // console.log(err)
    }
  }



  async function acceptanceEmailSentTrue(idToClose) {
    try {
      await Order.updateOne(
        { upserveId: idToClose },
        { $set: { acceptanceEmailSent: true } },
        { multi: true }
      );
    } catch (err) {
      // console.log(err)
    }
  }



  async function readyEmailSentTrue(idToClose) {
    try {
      await Order.updateOne(
        { upserveId: idToClose },
        { $set: { readyEmailSent: true } },
        { multi: true }
      );
    } catch (err) {
      // console.log(err)
    }
  }
  


  async function updateToStatusClosed(idToClose) {

    console.log(245)
    try {
      await Order.updateOne(
        { upserveId: idToClose },
        { $set: { status: "Closed" } },
        { multi: true }
      );
      console.log('closing order works in index.js line 1259')
    } catch (err) {
      // console.log(err)
      console.log(789)
    }
  }



  async function queryOrdersToClose(ordersToClose) {

    for (var closee in ordersToClose) {
      // if(acceptee === 0){
      //  console.log(typeof(closee), closee)
      Order.findOne(
        { upserveId: ordersToClose[closee], status: "Closed" },
        (err, orders) => {
          if (err) {
            res.status(500).send(err);
          } else {
            console.log(orders);
            // if(orders !== null){
            // updateToStatusClosed(orders.upserveId)
            // }
          }
        }
      );
      // }
    }
  }
  

  module.exports = { orderPostedTrue, acceptanceEmailSentTrue, readyEmailSentTrue, updateToStatusClosed, queryOrdersToClose  }