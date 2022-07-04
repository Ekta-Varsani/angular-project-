const express = require("express");
const app = express()
const router = express.Router();
const {
    DriverCreate,
    DriverAll,
    DriverUpdate,
    DriverDelete,
    AssignVehicle,
    StatusUpdate,
    AddBank
} = require("../controller/driverController");
const { upload } = require("../Middleware");

router.post("/create", upload.single('image'), DriverCreate)
router.get("/getDrivers", DriverAll)
router.put("/update/:id", upload.single('image'), DriverUpdate)
router.delete("/remove/:id", DriverDelete)
router.put("/assignVehicle/:id", AssignVehicle)
router.put("/addBank/:id", AddBank)
router.put("/updateStatus/:id",StatusUpdate)

module.exports = router;