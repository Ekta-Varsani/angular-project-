const VehiclePrice = require("../model/vehiclePriceModel");

//add ---
const AddPrice = async(req, res) => {
    const newPrice = new VehiclePrice({
        countryId: req.body.countryId,
        CityName: req.body.CityName,
        ServiceType: req.body.ServiceType,
        MaxSpace: req.body.MaxSpace,
        Profite: req.body.Profite,
        MinFare: req.body.MinFare,
        DistancePrice: req.body.DistancePrice,
        BasePrice: req.body.BasePrice,
        PpUD: req.body.PpUD,
        PpUT: req.body.PpUT,
        finalCost: req.body.finalCost
    })
    try {
        const vehicles = new VehiclePrice(newPrice);
        // const savedCountery = await Counteries.save();
        vehicles.save()
        res.status(200).json(vehicles);
    } catch (error) {
        res.json(error)
    }
}

//get
const VehiclePriceAll = async (req, res) => {
    try {
      const data = await await VehiclePrice.find({})
      .populate(
          "countryId", "CounteryName"
      )
      .populate(
          "ServiceType"
      )
      res.json(data);
    } catch (error) {
      res.json({ Error: error });
    }
  };

module.exports = {
    AddPrice,
    VehiclePriceAll
}