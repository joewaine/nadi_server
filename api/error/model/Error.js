const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errorSchema = mongoose.Schema({
  orderInfo: {
    type: Object,
    required: [true]
  },
  errorInfo: {
    type: Object,
    required: [true]
  },
  successFail: {
    type: Boolean,
    required: [true]
  }   
});



const Error = mongoose.model("Error", errorSchema);
module.exports = Error;
