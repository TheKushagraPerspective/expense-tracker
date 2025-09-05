const express = require("express");
const router = express.Router();
const {registerUser , getOTP , verifyOTP , getUserDetails , updateUser , updateCurrency , updatePassword , deleteAccount} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");


// POST /api/user/register
router.post("/register" , registerUser);

// POST /api/user/get-otp
router.post("/get-otp" , getOTP);

// POST /api/user/verify-otp
router.post("/verify-otp" , verifyOTP);

// GET /api/user/profile
router.get("/profile" , authMiddleware , getUserDetails);

// PUT /api/user
router.put("/" , authMiddleware , updateUser);

// PUT /api/user/currency
router.put("/currency" , authMiddleware , updateCurrency);

// PUT /api/user/update-password
router.put("/update-password" , authMiddleware , updatePassword);

// DELETE /api/user/delete-account
router.delete("/delete-account" , authMiddleware , deleteAccount);


module.exports = router;