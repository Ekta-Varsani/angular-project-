const RideCreate = require("../model/rideCreateModel")
const User = require("../model/userModel")
const VehiclePrice = require("../model/vehiclePriceModel")
const City = require("../model/cityModel")
const Vehicle = require("../model/vehicleModel")
const Driver = require("../model/driverModel")

const nodemailer = require("nodemailer");

const stripe = require("stripe")('sk_test_51LGcrmItXZ8PhVwXc8CnghuVOPiwde0Qlv5LkIWg8aqob1GlfAHLLjchuxAfV4WXUiEvzB8ElFt4NTGRrzsFf3xK00N40tQcUi');

//add ride---
const RideCreateAdd = async (req, res) => {
    try {
        const { countryId, UserDetail, PickUpLocation, DropOffLocation, Date, VehiclePriceDetail, Distance, Time, Cash, finalCost, MidPoint, creationdate, Status, DriverDetail, driverStatus, assignDriver, VehicleId } = req.body;
        const rideObj = {
            countryId, 
            UserDetail, 
            PickUpLocation, 
            DropOffLocation, 
            Date, 
            VehiclePriceDetail, 
            Distance, 
            Time,
            Cash,
            finalCost,
            MidPoint,
            creationdate,
            Status,
            DriverDetail,
            driverStatus,
            assignDriver,
            VehicleId
        };
        const rides = new RideCreate(rideObj);
        rides.save()
        res.status(200).json(rides);

    } catch (error) {
        console.log(error);
        res.status(401).send(error);
    }
}

//get ride--
const RideAll = async (req, res) => {
    try {
      const data = await RideCreate.find()
      .populate("UserDetail")
      .populate("DriverDetail")
      .populate("VehiclePriceDetail").populate({
        path: 'VehiclePriceDetail',
        populate:[ 
          {
            path: 'ServiceType',
            model: 'Vehicle'
          },
          {
            path: 'countryId',
            model: 'Countery',
            select: 'CounteryName'
          },
          {
            path: 'CityName',
            model: 'City',
            select: 'CityName'
          }
        ]
      })
      
      res.json(data);
    } catch (error) {
      res.json({ Error: error });
    }
};

//lookup
const rideAllAgg = async (req, res) => {
  try{
    const data = await RideCreate.aggregate([
      {
        $lookup: {
          from: User.collection.name,
          localField: "UserDetail",
          foreignField: "_id",
          as: "UserDetail"
        }
      },
      {
        $unwind: "$UserDetail"
      },

      {
        $lookup: {
          from: VehiclePrice.collection.name,
          localField: "VehiclePriceDetail",
          foreignField: "_id",
          as: "VehiclePriceDetail"
        }
      },
      {
        $unwind: "$VehiclePriceDetail"
      },

      {
        $lookup: {
          from: City.collection.name,
          localField: "VehiclePriceDetail.CityName",
          foreignField: "_id",
          as: "CityDetail"
        }
      },
      {
        $unwind: "$CityDetail"
      },

      {
        $lookup: {
          from: Vehicle.collection.name,
          localField: "VehiclePriceDetail.ServiceType",
          foreignField: "_id",
          as: "VehicleDetail"
        }
      },
      {
        $unwind: "$VehicleDetail"
      },
    
    ])

    res.json(data)
  }
  catch(err){
    res.json(err)
  }
}

//pagination
const paginationApi = async (req, res) => {
  try{
    const {page = 1, limit = 2} = req.body;
    const setPage = await RideCreate.find()
    .populate("UserDetail")
    .populate("DriverDetail")
    .populate("VehiclePriceDetail").populate({
      path: 'VehiclePriceDetail',
      populate:[ 
        {
          path: 'ServiceType',
          model: 'Vehicle'
        },
        {
          path: 'countryId',
          model: 'Countery',
          select: 'CounteryName'
        },
        {
          path: 'CityName',
          model: 'City',
          select: 'CityName'
        }
      ]
    })
    .limit(limit*1)
    .skip((page-1) * limit)
    res.json(setPage)
  }
  catch(error){
    res.json(error)
  }
}

//get accepted or canceled rides
const RideAcceptedOrCanceled = async (req, res) => {
  try {
    const data = await RideCreate.find({$or: [{Status: 'accepted'}, {Status: 'canceled'}, {Status: 'completed'}]})
    .populate("UserDetail")
    .populate("DriverDetail")
    .populate("VehiclePriceDetail").populate({
      path: 'VehiclePriceDetail',
      populate:[ 
        {
          path: 'ServiceType',
          model: 'Vehicle'
        },
        {
          path: 'countryId',
          model: 'Countery',
          select: 'CounteryName'
        },
        {
          path: 'CityName',
          model: 'City',
          select: 'CityName'
        }
      ]
    })
    
    res.json(data);
  } catch (error) {
    res.json({ Error: error });
  }
};

//pagination for accepted or canceled rides
const paginationApiForHistory = async (req, res) => {
  try{
    const {page = 1, limit = 2} = req.body;
    const setPage = await RideCreate.find({$or: [{Status: 'accepted'}, {Status: 'canceled'}, {Status: 'completed'}]})
    .populate("UserDetail")
    .populate("DriverDetail")
    .populate("VehiclePriceDetail").populate({
      path: 'VehiclePriceDetail',
      populate:[ 
        {
          path: 'ServiceType',
          model: 'Vehicle'
        },
        {
          path: 'countryId',
          model: 'Countery',
          select: 'CounteryName'
        },
        {
          path: 'CityName',
          model: 'City',
          select: 'CityName'
        }
      ]
    })
    .limit(limit*1)
    .skip((page-1) * limit)
    res.json(setPage)
  }
  catch(error){
    res.json(error)
  }
}

//approved or not
const GetStatus = async (req, res) => {
  const approve = {
      Status: req.body.Status,
      DriverDetail: req.body.DriverDetail
  }
  try {
      const updateDetail = await RideCreate.findByIdAndUpdate(
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

//delete ride-----postman
const deleteRide = async (req, res) => {
  try {
    const removeRide = await RideCreate.findByIdAndDelete(req.params.id);
    res.json(removeRide);
  } catch (error) {
    res.json({ Error: error });
  }
};

//update ride
const updateRide = async (req, res) => {
  try{
    const status = {
      Status: req.body.Status,
      DriverDetail: req.body.DriverDetail
    }
    const updatedStatus = await RideCreate.findByIdAndUpdate(
      {_id: req.params.id},
      status,
      {new: true}
    );

    // on ride end
    if(status.Status == 'completed'){
      
      //invoice
      const selectedRide = await RideCreate.findByIdAndUpdate(
        {_id: req.params.id},
        {driverStatus: 'end trip'},
        {new: true}
      )

      //payment---------
       await User.findById(updatedStatus.UserDetail)
      .exec(async(err, data) => {
        if(err){
          console.log(err);
        }
        else{
          //create payment intent
          const paymentIntent = await stripe.paymentIntents.create({
            amount: selectedRide.finalCost,
            currency: 'usd',
            payment_method_types: ['card'],
            customer: data.card.customer,
          });
          
          //confirm payment
          const paymentIntentConfirm = await stripe.paymentIntents.confirm(
            paymentIntent.id,
            {payment_method: 'pm_card_visa'}
          );

          const rideDriver = await Driver.findById(selectedRide.DriverDetail)
          
          //trasfer from admin to driver
          const txn = await stripe.customers.createBalanceTransaction(
            rideDriver.Bank.customer,
            {
              amount: (selectedRide.finalCost) * 100  ,
              currency: 'usd',
            }
          );


          // send invoice to user
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ektavarsani13@gmail.com',
              pass: 'rapfortijgtoxwhz'
            }
          });
          
          var mailOptions = {
            from: 'ektavarsani13@gmail.com',
            to: data.Email,
            subject: 'Ride history',
            html: `
              Distance of your ride was <strong>${selectedRide.Distance}</strong> <br>
              Cost: <strong> ${selectedRide.finalCost}</strong>
            `
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });


        }
      })
    
    }
    res.json(updatedStatus)
  }
  catch(error){
    res.json(error)
  }
}

module.exports = {
    RideCreateAdd,
    RideAll,
    paginationApi,
    GetStatus,
    deleteRide,
    updateRide,
    paginationApiForHistory,
    RideAcceptedOrCanceled,
    rideAllAgg
}