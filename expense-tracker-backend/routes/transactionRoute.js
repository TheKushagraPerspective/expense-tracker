const express = require("express");
const router = express.Router();

const {
    newTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware")


// POST /api/transaction
router.post("/", authMiddleware , newTransaction);


// GET /api/transaction
router.get("/", authMiddleware , getTransaction);


// PUT /api/transaction/:id
router.put("/:id", authMiddleware , updateTransaction);


// DELETE /api/transaction/:id
router.delete("/:id", authMiddleware , deleteTransaction);


module.exports = router;
