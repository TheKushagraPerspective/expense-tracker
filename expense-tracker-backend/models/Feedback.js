const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    name : {
        type : String,
        trim : true
    },
    email : {
        type : String,
        lowercase : true,
        trim : true
    },
    category : {
        type : String,
        required : [true , "Feedback Category is required"]
    },
    message : {
        type : String,
    },
    rating : {
        type : String,
        required : [true , "Rating is required"]
    }
} , {timestamps : true})

module.exports = mongoose.model("Feedback" , feedbackSchema);