const express = require("express");
const router = express.Router();
const {registerUser , Login , getOTP , verifyOTP , requestReset , verifyToken , resetPassword , getUserDetails , updateUser , updateCurrency , updatePassword , deleteAccount , changeProfileImage , removeProfileImage} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const {upload} = require("../middleware/multer");



// POST /api/user/register
router.post("/register" , registerUser);

// POST /api/user/login
router.post("/login" , Login);

// POST /api/user/get-otp
router.post("/get-otp" , getOTP);

// POST /api/user/verify-otp
router.post("/verify-otp" , verifyOTP);

// POST /api/user/request-reset
router.post("/request-reset" , requestReset);

// POST /api/user/verify-token
router.post("/verify-token" , verifyToken);

// POST /api/user/reset-password
router.post("/reset-password" , resetPassword);

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

// POST /api/user/upload-profile-image
router.post("/change-profile-image" , authMiddleware , upload.single("file") , changeProfileImage);

// PUT /api/user/delete-profile-image
router.put("/delete-profile-image" , authMiddleware , removeProfileImage);


module.exports = router;