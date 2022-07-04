// const { response } = require("express");
const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
    UserName: {
      type: String,
      lowercase: true,
    },
    Password: {
        type: String
    }
    
  });
  
  module.exports = mongoose.model("Login", LoginSchema);