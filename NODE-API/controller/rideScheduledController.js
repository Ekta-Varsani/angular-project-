const RideSchedule = require("../model/rideScheduleModel")
var cron = require('node-cron');

const express = require('express');
const app = express()

const http = require('http');
let server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', () => {
  console.log("connected");
})

io.emit('updateReq', async (socket) => {

    
})

//add request
const AddSchedule = async (req, res) => {
    try {
        const rides = await RideSchedule.find({ RideDetail: req.body.RideDetail })
        console.log(rides);
        if (rides.length == 0) {
            const { RideDetail, DriverDetail, Status, SelectedDriver, reqTime } = req.body;
            const rideObj = {
                RideDetail,
                DriverDetail,
                Status,
                SelectedDriver,
                reqTime
            };
            const ride = new RideSchedule(rideObj);
            ride.save()
        }
        else {
            const newData = await RideSchedule.findByIdAndUpdate(
                rides[0]._id,
                { DriverDetail: req.body.DriverDetail, Status: null, reqTime: Date.now() },
                { new: true }
            )
        }
    }
    catch (error) {
        console.log(error);
    }

}

//update request
const reqUpdate = async (req, res) => {

    try {
        const data = {
            RideDetail: req.body.RideDetail,
            DriverDetail: req.body.DriverDetail,
            Status: req.body.Status

        };

        const updateRqe = await RideSchedule.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            data,
            { new: true }
        );
        res.json(updateRqe);
    } catch (error) {
        res.status(401).send(error);
    }
};

//get requests
const allrideReqests = async (req, res) => {
    try {
        const allRides = await RideSchedule.find({})
            .populate("RideDetail").populate({
                path: "RideDetail",
                populate: {
                    path: 'UserDetail',
                    model: 'User'
                }
            })
            .populate("DriverDetail")

        res.json(allRides)

    }
    catch (error) {
        res.send(error)
    }
}

//accept or reject
const AcceptOrReject = async (req, res) => {
    const approve = {
        Status: req.body.Status
    }
    try {
        const updateDetail = await RideSchedule.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            approve,
            { new: true }
        );
        res.json(updateDetail)
    }
    catch (err) {
        res.send(err);
    }
}


module.exports = {
    AddSchedule,
    allrideReqests,
    AcceptOrReject,
    reqUpdate
}