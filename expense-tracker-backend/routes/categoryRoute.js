const express = require("express");
const router = express.Router();
const {newCategory , getCategory , updateCategory , deleteCategory} = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");


// POST /api/category
router.post("/" , authMiddleware , newCategory);

// GET /api/category
router.get("/" , authMiddleware , getCategory);

// PUT /api/category/:id
router.put("/:id" , authMiddleware , updateCategory);

// DELETE /api/category/:id
router.delete("/:id" , authMiddleware , deleteCategory);


module.exports = router;