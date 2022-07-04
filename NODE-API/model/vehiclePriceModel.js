const mongoose = require("mongoose");

const VehiclePriceSchema = new mongoose.Schema({
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Countery",
    },
    CityName: {
        type: mongoose.Schema.Types.ObjectId,
        tef: "City"
    },
    ServiceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
    },
    MaxSpace: {
        type: Number
    },
    Profite: {
        type: Number
    },
    MinFare: {
        type: Number
    },
    DistancePrice: {
        type: Number
    },
    BasePrice: {
        type: Number
    },
    PpUD: {
        type: Number
    },
    PpUT: {
        type: Number
    },
    finalCost: Number
});

module.exports = mongoose.model("VehiclePrice", VehiclePriceSchema);


