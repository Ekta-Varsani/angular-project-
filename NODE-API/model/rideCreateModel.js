const mongoose = require("mongoose");

const CreateRideSchema = new mongoose.Schema({
    UserDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Countery",
    },
    PickUpLocation: {
        type: String
    },
    DropOffLocation: {
        type: String
    },
    MidPoint: {
        type: String
    },
    Date: {
        type: Date,
        default: new Date()
    },
    VehiclePriceDetail:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehiclePrice"
    },
    VehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
    },
    Distance: {
        type: String
    },
    Time: {
        type: String
    },
    Cash:{
        type: String
    },
    finalCost:{
        type: Number
    },
    creationdate:{
        type: Date
    },
    Status : {
        type: String
    },
    DriverDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    driverStatus: {
        type: String
    },
    assignDriver: {
        type: Array
    },
    
});

module.exports =  mongoose.model("CreateRide", CreateRideSchema);