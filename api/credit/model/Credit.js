const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const creditSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true],
  },
  approvalData: {
    type: Object,
    required: [true],
  },
  primary: {
    type: Boolean,
    required: [true],
  },
  maskedNumber: {
    type: String,
    required: [true],
  },
});

// creditSchema.statics.findByCreditId = async (id) => {
//     let _id = id;
//     const credit = await Credit.findOne({ _id });

//     if(!credit) {
//         throw new Error({ error: "Invalid credit id" });
//       }
//       // console.log(credit)
//       return credit
// }

//this method search for a credit by email
creditSchema.statics.findByCreditEmail = async (email) => {
  const credit = await Credit.find({ email });
  // console.log(credit)
  if (!credit) {
    throw new Error({ error: "Invalid login details" });
  }

  return credit;
};

const Credit = mongoose.model("Credit", creditSchema);
module.exports = Credit;
