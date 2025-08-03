const User = require("../models/User");
const Category = require("../models/Category");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();



const registerUser = async (req , res) => {
    
    try {
        const {name , email , password , mobile} = req.body;

        if(!name || !email || !password || !mobile) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(401).json({ msg: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = new User({name , email , password : hashedPassword , mobile});
        await newUser.save();

        const defaultCategories = [
        // Income Categories
        { name: "Salary / Compensation", type: "income", userId: newUser._id },
        { name: "Business Income", type: "income", userId: newUser._id },
        { name: "Consulting / Freelance", type: "income", userId: newUser._id },
        { name: "Investments Returns", type: "income", userId: newUser._id },
        { name: "Gifts", type: "income", userId: newUser._id },
        { name: "Other Income", type: "income", userId: newUser._id },

        // Expense Categories
        { name: "Meals & Dining", type: "expense", userId: newUser._id },
        { name: "Transportation", type: "expense", userId: newUser._id },
        { name: "Housing / Rent", type: "expense", userId: newUser._id },
        { name: "Utilities (Electricity, Water)", type: "expense", userId: newUser._id },  
        { name: "Groceries & Essentials", type: "expense", userId: newUser._id },
        { name: "Healthcare & Insurance", type: "expense", userId: newUser._id },      
        { name: "Entertainment (Subscriptions)", type: "expense", userId: newUser._id },
        { name: "Shopping", type: "expense", userId: newUser._id },
        { name: "Education", type: "expense", userId: newUser._id },
        { name: "EMI / Loans", type: "expense", userId: newUser._id },
        { name: "Miscellaneous", type: "expense", userId: newUser._id }
        ];

        await Category.insertMany(defaultCategories);

        return res.status(200).json({
            success : true,
            msg : "User registered successfully",
            userId : newUser._id
        });
    } catch (error) {
        console.log("Error in register " , error);
        return res.status(500).json({msg : "Server error", error})
    }

};



const loginUser = async(req , res) => {
    
    try {
        const {email , password} = req.body;


        if(!email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const existingUser = await User.findOne({email});


        if(!existingUser) {
            return res.status(401).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(password , existingUser.password);
        if(!isMatch) {
            return res.status(402).json({ msg: "incorrect password" });
        }

        const token = jwt.sign(
            {userId : existingUser._id,
             email : existingUser.email},
             process.env.JWT_SECRET,
            {expiresIn : "7d"}
        );

        return res.status(200).json({
            success : true,
            msg : "Login Successfully",
            token,
            userData: {
                name : existingUser.name,
                email : existingUser.email,
                mobile : existingUser.mobile
            }
        });

    } catch (error) {
        return res.status(500).json({ msg: "Server error", error });
    }

}



const getUserDetails = async(req , res) => {

    try {
        const userId = req.user.userId;

        const user = await User.findOne({_id : userId});

        if(!user) {
            return res.status(400).json({
                success: false,
                msg : "User Not Found",
            })
        }

        return res.status(200).json({
            success: true,
            msg: "user details found",
            data: user,
        })
    } catch (error) {
        console.error("Error in getUserDetails:", error.message);
        return res.status(500).json({
            success: false,
            msg: "Server error",
        });
    }

}




const updateUser = async(req , res) => {
    try {
        
        const userId = req.user.userId; // From authMiddleware
        const updateData = req.body;

        if(!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ msg: "No data to update." });
        }

        // ✅ Mobile number validation (add this)
        if (updateData.mobile && !/^\d{10}$/.test(updateData.mobile)) {
            return res.status(400).json({ msg: "Invalid mobile number format" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {new: true},
        )

        if(!updatedUser) {
            return res.status(401).json({msg : "User not found"})
        }



        return res.status(200).json({
            success : true,
            msg : "Updated Successfully",
            userData: {
                name : updatedUser.name,
                email : updatedUser.email,
                mobile : updatedUser.mobile
            }
        });

    } catch (error) {
        return res.status(500).json({msg : "Server Error from updateUser"});
    }
}


const updateCurrency = async(req , res) => {

    try {
        const userId = req.user.userId;
        const {currency} = req.body;

        if(!currency) {
            return res.status(400).json({ message: "Currency is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {currency: currency},
            {new : true}
        );

        return res.status(200).json({ 
            success : true,
            message: "Currency updated", 
            currency: updatedUser.currency 
        });
    } catch (err) {
        return res.status(500).json({ message: "Server Error", error: err.message });
    }

}


const updatePassword = async(req , res) => {
    const userId = req.user.userId;
    const {oldPassword , newPassword , confirmPassword} = req.body;

    try {
        const user = await User.findOne({_id : userId});
        const match = await bcrypt.compare(oldPassword , user.password);

        if(!match) {
            return res.status(401).json({message: "Old Password is wrong"});
        }

        if(newPassword !== confirmPassword) {
            return res.status(401).json({message: "Confirm Password is not matched with New Password"});
        }

        
        // we can do like this 
        // const hashedPassword = await bcrypt.hash(newPassword , 10);
        // const res = await User.findByIdAndUpdate(
        //     userId,
        //     {password: newPassword},
        //     {new: true}
        // )

        // OR
        // we can do like this also
        user.password = await bcrypt.hash(newPassword , 10);
        await User.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({message: "Server Error"});
    }
}


const deleteAccount = async(req , res) => {
    const userId = req.user.userId;

    try {
        const deletedUser = await User.findByIdAndDelete({_id : userId});

        return res.status(200).json({
            success : true,
            message : "User Account Deleted Successfully",
            data : deletedUser
        })
    } catch (err) {
        return res.status(500).json({
            message: "Server Error" , error: err.message
        })
    }
}



module.exports = {
    registerUser,
    loginUser,
    getUserDetails,
    updateUser,
    updateCurrency,
    updatePassword,
    deleteAccount
}