const express = require("express");
const app = express()
const router = express.Router();
const {
    CounteryAll,
    CounteryCreate,
    CounteryUpdate,
    CounteryDelete,
    search,
    getCountryById,
    countryUpdate
  } = require("../controller/counteryController")
  const {upload} = require("../Middleware")

router.get("/", CounteryAll)
router.post("/create",upload.single("Sign") , CounteryCreate)
router.put("/update/:id", upload.single("Sign"), CounteryUpdate)
router.delete("/remove/:id", CounteryDelete)
router.post("/search", search)
// router.post("/updateCountry/:id", countryUpdate)
router.get("/get/:id", getCountryById)

module.exports = router;