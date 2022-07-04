const { render } = require("ejs");
const express = require("express");
const session = require('express-session')
const flash = require("connect-flash")
const fs = require("fs")
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 4000;
const Countery = require("./model/counteryModel");
const User = require("./model/userModel")
const cors = require("cors")
var cron = require('node-cron');
// const stripe = require('stripe')('sk_test_51LCzWhSAPqahIZkeL5r5CIugFPPcunyTre1R1iSnBhY9ZNyGpXH84v0wfwGjRkhJICexFlLA0hxzPXQchltyq9q0003xy5kNwn');

const stripe = require('stripe')('sk_test_51LGcrmItXZ8PhVwXc8CnghuVOPiwde0Qlv5LkIWg8aqob1GlfAHLLjchuxAfV4WXUiEvzB8ElFt4NTGRrzsFf3xK00N40tQcUi')

//middeleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: false,
}))
app.use(flash())
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"))
app.use("js", express.static("js"))

const { upload } = require("./Middleware/index");

app.use(express.static('public')); 
app.use('/uploads', express.static('uploads'));

app.use(cors())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.removeHeader('x-powered-by');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//login
app.get("/login", (req, res) => {
  res.render("login")
})

//add countries
app.post("/country", (req, res) => {
  var countrydetail = new Countery({
    CounteryName: req.body.countryName,
    CurrencyCode: req.body.CurrencyCode,
    CounteryCode: req.body.CountryCode,
    CurrencySign: req.body.CurrencySign,
    Sign: req.body.sign
  });
  if (countrydetail) {
    req.flash("message", "Countery added successfully!!")
    countrydetail.save()
    res.redirect("/country")
  }
})

//display countries
app.get("/country", (req, res) => {
  Countery.find({}, (error, countries) => {
    Countery.find({ CounteryName: { $regex: req.body.CounteryName } }, (error, data) => {
      res.render("country", {
        countryList: countries,
        countryData: data,
        message: req.flash("message")
      })
    })
  })
})

//update country
app.post("/countryUpdate", (req, res) => {
  countryDetail = {
    CounteryCode: req.body.coco,
    CurrencyCode: req.body.cuco,
    CurrencySign: req.body.cusi,
    CounteryName: req.body.CountryName
  };

  Countery.findByIdAndUpdate(req.body.idUpdate, countryDetail, { new: true }, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      req.flash("message", "Countery updated successfully!!")
      res.redirect("/country")
    }
  })

})

//search country
app.post("/searchCountry", async (req, res) => {
  Countery.find({
    CounteryName: { $regex: req.body.search },
  }, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      res.render("country", { countryList: data })
    }
  });
})

// display user
app.get("/user", async (req, res) => {
  const userList = await User.aggregate([
    {
      $lookup: {
        from: Countery.collection.name,
        localField: "countryId",
        foreignField: "_id",
        as: "country",
      }
    },
    {
      $unwind: "$country",
    }
  ])
  // console.log(userList);
  res.render("user", {
    userList: userList,
    message: req.flash("message")
  })
})

//add user
app.post("/user", upload.single("image"), (req, res) => {
  if (req.file) {
    var user = new User({
      UserName: req.body.name,
      countryId: req.body.countryName,
      Email: req.body.email,
      PhoneNumber: req.body.phone,
      // image: req.file.filename,
      image: "http://localhost:4000" + "/public/" + req.file.originalname,
    });
  }
  else {
    var user = new User({
      UserName: req.body.name,
      countryId: req.body.countryName,
      Email: req.body.email,
      PhoneNumber: req.body.phone,
    });
  }
  if (user) {
    req.flash("message", "User added successfully!!")
    user.save()
    res.redirect("/user")
  }
});

//update user
app.post("/updateUser", upload.single("image"), (req, res) => {

  if (req.file) {
    var user = ({
      UserName: req.body.Name,
      countryId: req.body.CountryName,
      Email: req.body.Email,
      PhoneNumber: req.body.phone,
      image: "http://localhost:4000" + "/public/" + req.file.originalname,
    });
  }
  else {
    var user = ({
      UserName: req.body.Name,
      countryId: req.body.CountryName,
      Email: req.body.Email,
      PhoneNumber: req.body.phone,
    });
  }

  User.findByIdAndUpdate(req.body.updateUser, user, { new: true }, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      req.flash("message", "User updated successfully!!")
      res.redirect("/user")
    }
  })

})

//delete user
app.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  const user1 = User.findOne({ id })
  // console.log(user1);
  User.findByIdAndRemove(id, (err, result) => {
    // var imagePath = user1.image
    // console.log(imagePath);
    //   var filePath = "./uploads" + imagePath;
    //   fs.unlinkSync(filePath);
    req.flash("message", "User deleted successfully!!")
    res.redirect("/user")
  })
})

//search users
app.post("/searchusers", async (req, res) => {
  User.find({
    "$or": [
      { "UserName": { $regex: req.body.search } },
      { "Email": { $regex: req.body.search } },
      { "PhoneNumber": { $regex: req.body.search } },
    ]
  }, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      res.render("user", { userList: data })
    }
  });

})

mongoose.connect(
  "mongodb://localhost:27017/Countery",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to db");
  }
);

//import routes
const CounteryRoutes = require("./routes/counteryRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const loginRoutes = require("./routes/loginRoutes");
const driverRoutes = require("./routes/driverRoutes");
const vehiclePriceRoutes = require("./routes/vehiclePriceRoutes");
const CityRoutes = require("./routes/cityRoutes");
const RideCreateRoutes = require("./routes/rideCreateRoutes");
const RideSchedule = require("./routes/rideScheduledRoutes");
const stripeCustomerRoutes = require("./routes/stripeRoutes")

//middleware
app.use("/api/countery", CounteryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/vehicle", vehicleRoutes)
app.use("/api", loginRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/vehiclePrice", vehiclePriceRoutes);
app.use("/api/city", CityRoutes);
app.use("/api/rideCreate", RideCreateRoutes);
app.use("/api/rideSchedule", RideSchedule);
app.use("/api/stripe", stripeCustomerRoutes)

//socket-----------------------
const http = require('http');
let server = http.createServer(app);
const io = require('socket.io')(server);

// let count=0
// io.on('connection', (socket) => {
//   console.log("connected");
//   socket.emit('updateReq', count)
// })




//----------------------cron------------------------//

const RideScheduleData = require("./model/rideScheduleModel")
const CreateRide = require("./model/rideCreateModel")
const Drivers = require("./model/driverModel")

cron.schedule('* * * * * *', async () => {

  //req decline & assign random driver-------
  let currentTime = Date.now()

  result = await RideScheduleData.find({ Status: { $eq: null } }) 

  for (let i = 0; i < result.length; i++) {
    if (currentTime > (parseInt(result[i].reqTime) + 3000)) {
    

      // console.log(updatedReq);
      const updatedReq = await RideScheduleData.findByIdAndUpdate(result[i]._id, { Status: 'declined', }, { new: true })

      
      io.on('connection', (socket) => {
        console.log("connected");
        socket.emit('updateReq', updatedReq)
      })

      await Drivers.findByIdAndUpdate(
        updatedReq.DriverDetail,
        { ReqStatus: null },
        { new: true }
      )

      //store array of assigned driver in ride data
      await CreateRide.findByIdAndUpdate(
        { _id: result[i].RideDetail },
        { $push: { assignDriver: result[i].DriverDetail._id } },
        { new: true }
      )

      CreateRide.findById(result[i].RideDetail)
        .populate("VehiclePriceDetail")
        .populate({
          path: 'VehiclePriceDetail',
          populate:
          {
            path: 'ServiceType',
            model: 'Vehicle'
          },
        })
        .exec(async (err, data) => {
          if (err) {
            console.log(err);
          }
          else {
            var driverList = []

            var driverss = await Drivers.find({ ServiceType: data.VehiclePriceDetail.ServiceType, OnlineStatus: 'approved', _id: { $nin: data.assignDriver }, ReqStatus: null })
              .exec(async (err, res) => {
                if (err) {
                  console.log(err);
                }
                else {
                  driverList = res

                  if (driverList.length == 0) {
                    await CreateRide.findByIdAndUpdate(updatedReq.RideDetail, { assignDriver: [] })

                    await CreateRide.findByIdAndUpdate(
                      { _id: result[i].RideDetail },
                      { Status: 'declined' },
                      { new: true }
                    )
                  }
                  else {
                    if (driverList.length != 0) {
                      if (updatedReq.Status == 'declined' && result[i].SelectedDriver != 'selected') {
                        var selectedDriver = driverList[Math.floor(Math.random() * driverList.length)];

                        //update status of driver
                        await Drivers.findByIdAndUpdate(
                          selectedDriver._id,
                          { ReqStatus: 'assigned' }
                        )

                        //update request
                        const abcd = await RideScheduleData.findByIdAndUpdate({ _id: result[i]._id }, { DriverDetail: selectedDriver._id, Status: null, reqTime: Date.now() }, { new: true })

                        //update driver in ride
                        await CreateRide.findByIdAndUpdate({ _id: updatedReq.RideDetail }, { DriverDetail: selectedDriver._id })
                      }
                    }
                  }
                }
              })
          }
        })
    }

  }

})





server.listen(port, () => {
  console.log(`server created at port no: ${port}`);
});