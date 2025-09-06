const User = require("../models/User");
const Category = require("../models/Category");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const client = require("../utils/redisClient");



const registerUser = async (req, res) => {

    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        //  Mobile number validation
        if (mobile && !/^\d{10}$/.test(mobile)) {
            return res.status(400).json({ msg: "Invalid mobile number format" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(401).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, mobile });
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
            success: true,
            message: "User registered successfully",
            userId: newUser._id
        });
    } catch (error) {
        console.log("Error in register ", error);
        return res.status(500).json({ message: "Server error", error })
    }

};


const Login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(402).json({ msg: "incorrect password" });
        }

        // Generate main login token
        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            msg: "Credentials verified successfully",
            token,
            userData: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                mobile: existingUser.mobile,
            },
        });

    } catch (error) {

    }

}


const getOTP = async (req, res) => {

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: "Email field is required" });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ msg: "User not found" });
        }

        const otpSixDigit = Math.floor(100000 + Math.random() * 900000).toString();   // 6-digit otp

        // Send OTP via mail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.Email_User,
                pass: process.env.Email_Password,
            }
        });

        const mailOptions = {
            from: process.env.Email_User,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otpSixDigit}. It expires in 5 minutes.`,
        }

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent: ", info.response);
        } catch (err) {
            console.error("Email error: ", err);
            return res.status(500).json({ success: false, msg: "Error in sending mail" });
        }

        // Store OTP with 5 minutes expiry
        await client.set(`otp:${email}`, otpSixDigit.toString(), { ex: 300 });

        return res.status(200).json({
            success: true,
            msg: "OTP Successfully sent to mail",
        });

    } catch (error) {
        return res.status(500).json({ msg: "Server error in get-otp", error });
    }

}


const verifyOTP = async (req, res) => {
    try {
        const { email, enteredOtp } = req.body;

        if (!email || !enteredOtp) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (!existingUser) {
            return res.status(401).json({ msg: "User not found" });
        }

        const storedOtp = await client.get(`otp:${email}`);

        if (!storedOtp) {
            return res.status(400).json({ msg: "OTP expired or not found" });
        }

        if (storedOtp.toString() !== enteredOtp.toString()) {
            return res.status(400).json({ msg: "Invalid OTP" });
        }

        // OTP correct → delete it from Redis (so can’t reuse)
        await client.del(`otp:${email}`);

        // Generate main login token
        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            msg: "OTP verified successfully",
            token,
            userData: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                mobile: existingUser.mobile,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, msg: "Server error in verifying otp" });
    }
};


const requestReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: "Email field is required" });
    }

    try {
        // Check user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (!existingUser) {
            return res.status(401).json({ msg: "User not found" });
        }

        const resetToken = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            },
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.Email_User,
                pass: process.env.Email_Password,
            }
        });

        const mailOptions = {
            from: process.env.Email_User,
            to: email,
            subject: "Reset your Expense Tracker password",
            text: `<pre> Hi Kushagra,
                Click the link below to reset your password. This link is valid for 15 minutes:
                https://expense-tracker-frontend-71kl.onrender.com/#/reset-password?token=${resetToken}
                If you didn’t request this, you can ignore this email.</pre>`,
        }

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent: ", info.response);
        } catch (err) {
            console.error("Email error: ", err);
            return res.status(500).json({ success: false, msg: "Error in sending mail" });
        }

        return res.status(200).json({
            success: true,
            msg: "Verification Link Successfully sent to mail",
            token: resetToken
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Server error in requestReset password" });
    }
}


const verifyToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, msg: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.status(200).json({
            success: true,
            msg: "Token is valid",
            userId: decoded.userId,
            email: decoded.email
        });
    } catch (error) {
        return res.status(400).json({ success: false, msg: "Invalid or expired reset link" });
    }
};



const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        const existingUser = await User.findOne({ email: decoded.email.toLowerCase() });
        if (!existingUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(newPassword , existingUser.password);
        if(isMatch) {
            return res.status(404).json({success: false , msg: "New Password must be different from Old Password"})
        }

        // we can do like this 
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword , 10);

        // Update user password securely
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            {password: hashedPassword},
            {new: true}
        )

        // OR
        // // we can do like this also
        // existingUser.password = await bcrypt.hash(newPassword, 10);
        // await existingUser.save();

        return res.status(200).json({ success: true, msg: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Server Error" });
    }
}


const getUserDetails = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "User Not Found",
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




const updateUser = async (req, res) => {
    try {

        const userId = req.user.userId; // From authMiddleware
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ msg: "No data to update." });
        }

        // ✅ Mobile number validation (add this)
        if (updateData.mobile && !/^\d{10}$/.test(updateData.mobile)) {
            return res.status(400).json({ msg: "Invalid mobile number format" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true },
        )

        if (!updatedUser) {
            return res.status(401).json({ msg: "User not found" })
        }

        return res.status(200).json({
            success: true,
            msg: "Updated Successfully",
            userData: {
                name: updatedUser.name,
                email: updatedUser.email,
                mobile: updatedUser.mobile
            }
        });

    } catch (error) {
        return res.status(500).json({ msg: "Server Error from updateUser" });
    }
}



const updateCurrency = async (req, res) => {

    try {
        const userId = req.user.userId;
        const { currency } = req.body;

        if (!currency) {
            return res.status(400).json({ message: "Currency is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { currency: currency },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Currency updated",
            currency: updatedUser.currency
        });
    } catch (err) {
        return res.status(500).json({ message: "Server Error", error: err.message });
    }

}



const updatePassword = async (req, res) => {
    const userId = req.user.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const match = await bcrypt.compare(oldPassword, existingUser.password);
        if (!match) {
            return res.status(401).json({ message: "Old Password is wrong" });
        }

        if (oldPassword === newPassword) {
            return res.status(401).json({ message: "Old Password and New Password must be different" })
        }

        if (newPassword !== confirmPassword) {
            return res.status(401).json({ message: "Confirm Password must be equal to New Password" });
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
        existingUser.password = await bcrypt.hash(newPassword, 10);
        await existingUser.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}



const deleteAccount = async (req, res) => {
    const userId = req.user.userId;

    try {
        const deletedUser = await User.findByIdAndDelete({ _id: userId });

        return res.status(200).json({
            success: true,
            message: "User Account Deleted Successfully",
            data: deletedUser
        })
    } catch (err) {
        return res.status(500).json({
            message: "Server Error", error: err.message
        })
    }
}





module.exports = {
    registerUser,
    Login,
    getOTP,
    verifyOTP,
    requestReset,
    verifyToken,
    resetPassword,
    getUserDetails,
    updateUser,
    updateCurrency,
    updatePassword,
    deleteAccount
}