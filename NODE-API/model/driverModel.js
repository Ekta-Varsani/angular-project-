const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  DriverName: {
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
    lowercase: true
  },
  PhoneNumber: {
    type: String,
    // match: /d{10}/
    // match :  /^(\()?\d{3}(\))??\d{3}\d{4}$/
  },
  ServiceType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
  OnlineStatus:{
    type: String
  },
  ReqStatus: {
    type: String
  },
  Bank: {
    type: Object
  }
});

module.exports = mongoose.model("Driver", DriverSchema);


