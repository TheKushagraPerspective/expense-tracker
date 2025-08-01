const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const transactionRoute = require("./routes/transactionRoute");



const connectionDB = require("./config/connection");
connectionDB(); 


// Middleware
const corsOptions = {
  origin: ["http://localhost:5173", "https://expense-tracker-frontend-71kl.onrender.com"], // your frontend port
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // allow token header
};
app.use(cors(corsOptions));
app.use(express.json());



app.use("/api/user" , userRoute);
app.use("/api/category" , categoryRoute);
app.use("/api/transaction" , transactionRoute);



const port = process.env.PORT || 3000;
app.listen(port , () => {
    console.log(`Server is running on ${port}`)
})