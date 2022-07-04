const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
    VehicleName: {
        type: String,
        lowercase: true
    },
    image: {
        type: String
    }
});

 
module.exports =  mongoose.model("Vehicle", VehicleSchema);