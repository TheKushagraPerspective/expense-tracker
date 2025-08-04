const Feedback = require("../models/Feedback");
const User = require("../models/User");

const newFeedback = async(req , res) => {
    const userId = req.user.userId;
    console.log("userId from token:", userId);
    let {fullName , email , category , message , rating} = req.body;

    try {
        const user = await User.findOne({_id : userId});
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not Found",
            })
        }

        if(!fullName || fullName.trim() === "") {
            fullName = user.name;
        }
        if(!email || email.trim() === "") {
            email = user.email;
        }

        const newFeedback = new Feedback({userId , name: fullName , email , category , message , rating});
        await newFeedback.save();

        return res.status(201).json({
            success: true,
            message: "Feedback saved successfully",
        })

    } catch (error) {
        console.error("Error saving feedback:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while saving feedback",
        });
    }

}


module.exports = {
    newFeedback,
}