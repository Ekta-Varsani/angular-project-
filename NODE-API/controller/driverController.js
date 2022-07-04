const Driver = require("../model/driverModel");
const Countery = require("../model/counteryModel");
const Vehicle = require("../model/vehicleModel")
const fs = require("fs");
const res = require("express/lib/response");
const stripe = require('stripe')('sk_test_51LGcrmItXZ8PhVwXc8CnghuVOPiwde0Qlv5LkIWg8aqob1GlfAHLLjchuxAfV4WXUiEvzB8ElFt4NTGRrzsFf3xK00N40tQcUi');

//add driver
const DriverCreate = async (req, res) => {
    const newDriver = new Driver({
        DriverName: req.body.DriverName,
        Email: req.body.Email,
        countryId: req.body.countryId,
        PhoneNumber: req.body.PhoneNumber,
        ServiceType: req.body.ServiceType,
        OnlineStatus: 'declined',
        ReqStatus: req.body.ReqStatus

    })
    try {
        if (req.file) {
            newDriver.image = "http://localhost:4000" + "/public/" + req.file.originalname
        }
        const data = await newDriver.save();
        res.json(data)
    }
    catch (error) {
        res.status(401).send(error)
    }
}

//get drivers
const DriverAll = async (req, res) => {
    try {
        const data = await Driver.find({}).populate(
            "countryId",
            "CounteryName"
        )
            .populate(
                "ServiceType",
                "VehicleName"
            );
        res.json(data);

        // const data = await Driver.aggregate([
        //     {
        //         $lookup: {
        //             from: Countery.collection.name,
        //             localField: "countryId",
        //             foreignField: "_id",
        //             as: "country"
        //         },

        //     },
        //     {
        //         $unwind: "$country"
        //     },
        //     {
        //         $lookup: {
        //             from: Vehicle.collection.name,
        //             localField: "ServiceType",
        //             foreignField: "_id",
        //             as: "vehicle"
        //         }
        //     },
        //     {
        //         $unwind: "$vehicle"
        //     }
        // ])
        // res.send(data)
    }
    catch (error) {
        res.json(error);
    }
};

//update driver
const DriverUpdate = async (req, res) => {
    const newDriver = {
        DriverName: req.body.DriverName,
        Email: req.body.Email,
        countryId: req.body.countryId,
        PhoneNumber: req.body.PhoneNumber,
        ServiceType: req.body.ServiceType
    }
    if (req.file) {
        newDriver.image = "http://localhost:4000" + "/public/" + req.file.originalname
    }
    try {
        const updateDetail = await Driver.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            newDriver,
            { new: true }
        );
        res.json(updateDetail)
    }
    catch (err) {
        res.send(err);
    }
}

//assign vehicle
const AssignVehicle = async (req, res) => {
    const newDriver = {
        ServiceType: req.body.ServiceType,
        OnlineStatus: req.body.OnlineStatus
    }
    try {
        const updateDetail = await Driver.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            newDriver,
            { new: true }
        );
        res.json(updateDetail)
    }
    catch (err) {
        res.send(err);
    }
}

//update request status
const StatusUpdate = async (req, res) => {
    const data = {
        ReqStatus: req.body.ReqStatus
    }
    try{
        const updatedStatus = await Driver.findByIdAndUpdate(
            req.params.id,
            data,
            {new: true}
        )
        res.json(updatedStatus)
    }
    catch(error){
        res.send(error)
    }
}

//add bank
const AddBank = async (req, res) => {
    try {
        const token = await stripe.tokens.create({
            bank_account: {
                country: 'US',
                currency: 'usd',
                account_holder_name: req.body.DriverName,
                account_holder_type: 'individual',
                routing_number: req.body.routingNumber,
                account_number: req.body.accountNumber,
            },

        })

        const customer = await stripe.customers.create({
            name: req.body.DriverName,
            email: req.body.Email,
            source: token.id
        })

        const updatedDriver = await Driver.findByIdAndUpdate(
            req.params.id,
            { Bank: {bankDetail: token, customer: customer.id} },
            { new: true }
        )
        res.json(updatedDriver)

    }
    catch (error) {
        res.send(error)
    }
}

//delete driver
const DriverDelete = async (req, res) => {
    try {
        const id = req.params.id;
        const driverOne = await Driver.findOne({ id });
        const removeDriver = await Driver.findByIdAndDelete(req.params.id);

        imagePath = driverOne.image.split("public")[1];
        var filePath = "./uploads" + imagePath;
        fs.unlinkSync(filePath);

        res.json(removeDriver);
    } catch (error) {
        res.json({ Error: error });
    }
};

module.exports = {
    DriverCreate,
    DriverAll,
    DriverUpdate,
    DriverDelete,
    AssignVehicle,
    StatusUpdate,
    AddBank
}

