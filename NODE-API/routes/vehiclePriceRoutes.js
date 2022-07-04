const express = require("express");
const app = express()
const router = express.Router();
const {
    AddPrice,
    VehiclePriceAll
} = require("../controller/vehiclePriceContoller");

router.post("/create", AddPrice);
router.get("/getPrice", VehiclePriceAll)

module.exports = router;