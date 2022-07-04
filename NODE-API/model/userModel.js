const { response } = require("express");
const mongoose = require("mongoose");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  UserName: {
    type: String,
    lowercase: true,
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Countery",
  },
  Email: {
    type: String,
    trim: true,
    lowercase: true,
    // unique: true,
    // required: "Email address is required",
    // validate: [validateEmail, "Please fill a valid email address"],
    // match: [
    //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //   "Please fill a valid email address",
    // ],
    
  },
  PhoneNumber: {
    type: String,
    // match: /d{10}/
    // match :  /^(\()?\d{3}(\))??\d{3}\d{4}$/
  },
  card: {
    type: Object
  }
});

module.exports = mongoose.model("User", UserSchema);


