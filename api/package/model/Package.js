const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true],
  },
  upserveId: {
    type: String,
    required: [true],
  },
  restaurant: {
    type: String,
    required: [true],
  },
  number: {
    type: Number,
    required: [true],
  },
  soldOut: {
    type: Boolean,
    required: [true],
  },
  object: {
    type: Object,
    required: [true],
  },
  timing_mask: {
    type: Object,
    required: [true],
  },
  recipients:{
    type: Array,
    required: [true],
  },
});

//this method search for a package by email
packageSchema.statics.findByPackageByUpserveId = async (upserveId) => {
  const package = await Package.find({ upserveId });
  console.log(package);
  if (!package) {
    throw new Error({ error: "invalid package id" });
  }

  return package;
};

const Package = mongoose.model("Package", packageSchema);
module.exports = Package;
