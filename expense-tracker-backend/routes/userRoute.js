const express = require("express");
const router = express.Router();
const {registerUser , loginUser , getUserDetails , updateUser , updateCurrency , deleteAccount} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");



router.post("/register" , registerUser);
router.post("/login" , loginUser);
router.get("/profile" , authMiddleware , getUserDetails);
router.put("/" , authMiddleware , updateUser);
router.put("/currency" , authMiddleware , updateCurrency);
router.delete("/delete-account" , authMiddleware , deleteAccount);

module.exports = router;