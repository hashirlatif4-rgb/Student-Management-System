const User = require("../model/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(403).json({
                message: "enter all fields"
            })
        }
        const exUser = await User.findOne({ email })
        if (exUser) {
            return res.status(409).json({
                message: "user already exist"
            })
        }
        const pass = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: pass
        })
        res.status(201).json({
            message: "signup successfully",
            user
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const exUser = await User.findOne({ email })
        if (!exUser) {
            return res.status(409).json({
                message: "user not exist"
            })
        }
    
        const isMatch = await bcrypt.compare(password , exUser.password )
        if (!isMatch) {
            return res.status(404).json({
                message: "Enter valid password"
            })
        }
        const token = jwt.sign({ id: exUser._id, email: exUser.email, role: exUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.status(201).json({
            message: "succesfully login",
            token
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const profile = async (req, res) => {
    try {
        const id = req.user.id
        const user = await User.findById(id)
        if (!user) {
            return res.status(403).json({
                message: "user not exist"
            })
        }
        res.status(201).json({
            message: "get profile successfully",
            user: {
                id:user._id,
                name: user.name,
                email: user.email,
                role:user.role
            }
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const uploads = async(req,res)=>{
    try{
        console.log(req.files);
console.log(req.body);
        if (!req.files || req.files.length===0) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }
        console.log(req.files)
        const id = req.params.id
        const user =await User.findById(id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.image = req.files.map(file=>file.path)

        await user.save()
        res.status(200).json({
            message: "Image uploaded successfully",
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(404).json({
                message: "enter email"
            })
        }
        const existEm = await User.findOne({ email })
        if (!existEm) {
            return res.status(404).json({
                message: "email not exist"
            })
        }
        const resetToken = crypto.randomBytes(32).toString("hex")
        existEm.resetToken = resetToken
        existEm.resetTokenExpireIn = Date.now() + 15 * 60 * 1000
        await existEm.save()

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`
        await transporter.sendMail({
            to: existEm.email,
            subject: "reset password",
            text: `click the link to reset password : ${resetLink}`
        })
        res.status(200).json({
            message: "Reset link sent to your email"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const resetPassword =async (req, res) => {
    try {
        const { resetToken } = req.params
        const { password } = req.body
        const user = await User.findOne({ resetToken })

        if (!resetToken) {
            return res.status(404).json({
                message: "token not exist"
            })
        }
        if (!user) {
            return res.status(404).json({
                message: "Invalid or expired reset token"
            });
        }
        const pass =await bcrypt.hash(password, 10)
        user.password = pass
        user.resetToken = undefined
        user.resetTokenExpireIn = undefined
        await user.save()

        res.status(200).json({
            message: "Password reset successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { signUp, logIn, profile, ForgotPassword ,resetPassword,uploads}