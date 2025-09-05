const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// all routes files
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const transactionRoute = require("./routes/transactionRoute");
const feedbackRoute = require("./routes/feedbackRoute");



const connectionDB = require("./config/connection");
connectionDB(); 


// Middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://expense-tracker-frontend-71kl.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


// explicitly handle preflight
// app.options("/*", cors(corsOptions));

app.use(express.json());



app.get("/", (req, res) => {
  res.send({ message: "API running" });
});

// all routes
app.use("/api/user" , userRoute);
app.use("/api/category" , categoryRoute);
app.use("/api/transaction" , transactionRoute);
app.use("/api/feedback" , feedbackRoute);



const port = process.env.PORT || 3000;
app.listen(port , () => {
    console.log(`Server is running on ${port}`)
})