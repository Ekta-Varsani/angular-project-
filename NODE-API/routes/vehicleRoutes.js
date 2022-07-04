const express = require("express");
const app = express()
const router = express.Router();
const {
    VehicleCreate,
    VehicleAll,
    VehicleUpdate
} = require("../controller/vehicleController");
const { upload } = require("../Middleware");

router.post("/create", upload.single("image"), VehicleCreate);
router.get("/allVehicle", VehicleAll),
router.put("/update/:id",upload.single("image"), VehicleUpdate)

module.exports = router;