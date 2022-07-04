const express = require("express");
const router = express.Router();

const { 
    stripeCustomer,
    payment
} = require("../controller/stripeController")

router.post("/addStripe", stripeCustomer)
router.post("/payment", payment)

module.exports = router;