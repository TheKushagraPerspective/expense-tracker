const express = require("express");
const router = express.Router();
const {registerUser , loginUser , updateUser} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");



router.post("/register" , registerUser);
router.post("/login" , loginUser);
router.put("/" , authMiddleware , updateUser);

module.exports = router;