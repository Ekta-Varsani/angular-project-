const express = require("express");
const app = express();
const Countery = require("../model/counteryModel");
const User = require("../model/userModel");
const fs = require("fs");
const path = require("path");
const exp = require("constants");
app.use(express.static("public"));
app.use("/images", express.static("uploads"));

const Driver = require("../model/driverModel")

//add user
const addUser = async (req, res) => {
  try {
    const { UserName, CounteryName, PhoneNumber, Email, card } = req.body;
    const existsCountery = await Countery.find({ CounteryName });
    if (existsCountery.length === 0) {
      res.status(400).json({ message: "Country does not exist" });
    } else {
      const countryId = existsCountery[0]._id;
      const user = {
        UserName,
        countryId,
        Email,
        PhoneNumber,
        card
      };
      if (req.file) {
        user.image =
          "http://localhost:4000" + "/public/" + req.file.originalname;
        // "E:/NODE-API/uploads" + req.file.originalname;
      }
      const existsPhone = await User.find({ PhoneNumber });
      if (existsPhone.length === 0) {
        const existsEmail = await User.find({ Email });
        if (existsEmail.length === 0) {
          const userObj = new User(user);
          const newUser = await userObj.save();
          // window.location.reload()
          res.status(200).json(newUser);
        } else {
          res.send("email already exists");
        }
      } else {
        res.send("Phone number already exists");
      }
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

// add user data
 const addUserNew =  async (req, res) => {
   
  const newuser = new User({
      UserName: req.body.UserName,
      Email: req.body.Email,
      countryId: req.body.countryId,
      PhoneNumber: req.body.PhoneNumber,
  })
  
  try {
      if (req.file) {
          newuser.image = "http://localhost:4000" + "/public/" + req.file.originalname
      }
      const data = await newuser.save();
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
        to: req.body.Email,
        subject: 'Ride history',
        html: `
         Hello ${data.UserName}....<br>
         Welcome to illuminati family..!!
        `
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.json(data)

  }
  catch (err) {
      res.send(err);
  }
};

//update user new
const updateUserNew = async (req, res) => {
 
  const newuser =  {
    UserName: req.body.UserName,
    Email: req.body.Email,
    countryId: req.body.countryId,
    PhoneNumber: req.body.PhoneNumber,
    card: req.body.card
  }
try {
  if (req.file) {
    newuser.image = "http://localhost:4000/public/" + req.file.filename
  }
    const updateUserDetail = await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      newuser,
      { new: true }
    );
    res.json(updateUserDetail)
}
catch (err) {
    res.send(err);
  }
}

//get all users
const getUser = async (req, res) => {
  try {
    const allUser = req.params.name;
    if (allUser === "alluser") {
      const userData = await User.find({}).populate(
        "countryId",
        "CounteryName"
      );
      res.status(200).json(userData);
    } else {
      const singleData = await User.find({
        $or: [
          { UserName: { $regex: req.params.name } },
          { Email: { $regex: req.params.name } },
          { PhoneNumber: { $regex: req.params.name } },
        ],
      }).populate("countryId", "CounteryName");
      res.status(200).json({ data: singleData });
    }
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

//search
const search = async (req, res) => {
  try {
    const result = await User.find({
      $or: [
        { UserName: { $regex: req.body.UserName } },
        { Email: { $regex: req.body.UserName } },
        { PhoneNumber: { $regex: req.body.UserName } },
      ],
    }).populate("countryId", { CounteryName: 1, _id: 0 });

    res.json(result);
  } catch (err) {
    res.send(err);
  }
};

//update
const updateUser = async (req, res) => {
  try {
    // const { UserName, CounteryName, PhoneNumber, Email } = req.body;
    // let imagePath;
    // const existsCountery = await Countery.find({ CounteryName });
    // if (existsCountery.length == 0) {
    //   res.status(400).json({ message: "Country does not exist" });
    // } else {
    //   const countryId = existsCountery[0]._id;
      const user = {
        UserName: req.body.UserName,
        countryId: req.body.countryId,
        Email: req.body.Email,
        PhoneNumber: req.body.PhoneNumber,
      };
      if (req.file) {
        imagePath = "/public/" + req.file.originalname;
        user.image = "http://localhost:4000" + imagePath;
      }
      const id = req.params.id;
      const user1 = await User.findOne({ id });
      const updateUserDetail = await User.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        user,
        { new: true }
      );
      imagePath = user1.image.split("public")[1];
      var filePath = "./uploads" + imagePath;
      fs.unlinkSync(filePath);

      res.json(updateUserDetail);
    // }
  } catch (error) {
    res.status(401).send(error);
  }
};

//delete
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
      const user1 = await User.findOne({ id });
    const removeUser = await User.findByIdAndDelete(req.params.id);

    imagePath = user1.image.split("public")[1];
      var filePath = "./uploads" + imagePath;
      fs.unlinkSync(filePath);

    res.json(removeUser);
  } catch (error) {
    res.json({ Error: error });
  }
};

//count
const countUser = async (req, res) => {
  try {
    const countt = await User.aggregate([
      {
        $lookup: {
          from: Countery.collection.name,
          localField: "countryId",
          foreignField: "_id",
          as: "country",
        },
      },
      {
        $group: {
          _id: { name: "$country.CounteryName" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(countt);
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};


module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  countUser,
  search,
  addUserNew,
  updateUserNew,
};
