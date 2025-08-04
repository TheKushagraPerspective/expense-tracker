const express = require("express");
const router = express.Router();
const {newFeedback} = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/" , authMiddleware , newFeedback);


module.exports = router;