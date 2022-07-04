const mongoose = require("mongoose");

const ScheduledRideSchema = new mongoose.Schema({
    RideDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CreateRide"
    },
    DriverDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    Status: {
        type: String
    },
    SelectedDriver: {
        type: String
    },
    reqTime: {
        type: String
    }
});

module.exports =  mongoose.model("ScheduledRide", ScheduledRideSchema);