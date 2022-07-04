const express = require("express");
const app = express()
const router = express.Router();
const {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  countUser,
  search,
  addUserNew,
  updateUserNew,
} = require("../controller/userController");
const { upload } = require("../Middleware");

router.post("/create", upload.single("image"), addUser);
router.post("/search", search)
router.get("/getuser/:name", getUser);
router.get("/count", countUser)
router.put("/update/:id", upload.single("image") ,updateUser);
router.delete("/remove/:id", deleteUser);
router.post("/addUser",upload.single("image"), addUserNew);
router.put("/updateUser/:id",upload.single("image") , updateUserNew)

module.exports = router;