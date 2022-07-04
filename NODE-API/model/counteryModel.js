const mongoose = require("mongoose");

const CounterySchema = new mongoose.Schema({
    CounteryName: {
        type: String,
        // unique: true,
        lowercase: true
    },
    CounteryCode : {
        type: String,
    },
    CurrencyCode: {
        type: String
    },
    Sign: {
        type: String
    },
    CurrencySign: {
        type: String
    }
});

 
module.exports =  mongoose.model("Countery", CounterySchema);