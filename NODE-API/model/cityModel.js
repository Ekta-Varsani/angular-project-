const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
    CityName: {
        type: String,
        lowercase: true
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Countery",
    },
    color: {
        type: String
    },
    latitude: {
        type: Array
    },
    
});

 
module.exports =  mongoose.model("City", CitySchema);