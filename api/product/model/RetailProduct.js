const mongoose = require("mongoose");

const retailproductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true],
  },
  menu: {
    type: Object,
    required: [true],
  },
});

retailproductSchema.statics.findByRetailProductId = async (id) => {
  let _id = id;
  const retailproduct = await RetailProduct.findOne({ _id });

  if (!retailproduct) {
    throw new Error({ error: "Invalid retailproduct id" });
  }
  // console.log(retailproduct)
  return retailproduct;
};

const RetailProduct = mongoose.model("RetailProduct", retailproductSchema);
module.exports = RetailProduct;
