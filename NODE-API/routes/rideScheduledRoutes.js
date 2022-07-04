const express = require("express");
const router = express.Router();
const {
    AddSchedule,
    allrideReqests,
    AcceptOrReject,
    reqUpdate
} = require("../controller/rideScheduledController")

router.post("/scheduledRide", AddSchedule)
router.get("/allRequests", allrideReqests)
router.put("/approve/:id", AcceptOrReject)
router.put("/updateReq/:id", reqUpdate)

module.exports = router