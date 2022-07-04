const express = require("express");
const app = express()
const router = express.Router();
const {
    CityCreate,
    getCity,
    CityUpdate
  } = require("../controller/cityController")
 
router.post("/create", CityCreate)
router.get("/getCity", getCity)
router.put("/update/:id", CityUpdate)

module.exports = router;