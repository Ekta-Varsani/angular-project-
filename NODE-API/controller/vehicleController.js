const express = require("express");
const app = express();
const Vehicle = require("../model/vehicleModel");
const fs = require("fs");
const path = require("path");
app.use(express.static("public"));
app.use("/images", express.static("uploads"));

//add vehicle
const VehicleCreate = async (req, res) => {
    try {
      const { VehicleName, image } = req.body;
      const VehicleObj = {
        VehicleName,
        image
      };
      if(req.file){
        VehicleObj.image = "http://localhost:4000" + "/public/" + req.file.originalname
      }
        const vehicles = new Vehicle(VehicleObj);
        // const savedCountery = await Counteries.save();
        vehicles.save()
        res.status(200).json(vehicles);
    } catch (error) {
      console.log(error);
      res.status(401).send(error);
    }
  };

  //get vehicle
  const VehicleAll = async (req, res) => {
    try {
      const data = await Vehicle.find()
      res.json(data);
    } catch (error) {
      res.json({ Error: error });
    }
  };

  //update vehicle
  const VehicleUpdate = async (req, res) => {
    
    try {
      const data = {
        VehicleName: req.body.VehicleName,
        // image: req.body.image
      };
      if(req.file){
        data.image = "http://localhost:4000" + "/public/" + req.file.originalname
      }
      const updateVehicle = await Vehicle.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        data,
        { new: true }
      );
      res.json(updateVehicle);
    } catch (error) {
      res.status(401).send(error);
    }
  };
  

  module.exports = {
    VehicleCreate,
    VehicleAll,
    VehicleUpdate
  };