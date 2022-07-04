const express = require("express");
const app = express()
const router = express.Router();
const {
    RideCreateAdd,
    RideAll,
    paginationApi, 
    GetStatus,
    deleteRide,
    updateRide,
    paginationApiForHistory,
    RideAcceptedOrCanceled,
    rideAllAgg
  } = require("../controller/rideCreateController")
 
router.post("/create", RideCreateAdd)
router.get("/getRide", RideAll)
router.post("/pagination", paginationApi)
router.put("/approvedOrNot/:id", GetStatus)
router.delete("/removeRide/:id", deleteRide)
router.put("/rideStatus/:id", updateRide)
router.post("/paginationApiForHistory", paginationApiForHistory)
router.get("/RideAcceptedOrCanceled", RideAcceptedOrCanceled)

router.get("/rideAllAgg", rideAllAgg)

module.exports = router;