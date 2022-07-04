const express = require("express");
const app = express()
const router = express.Router();
const {
    LoginData
} = require("../controller/loginController");

router.post("/login",  LoginData);

module.exports = router;