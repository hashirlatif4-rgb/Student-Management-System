const User = require("../model/User") 
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const addStudent = async (req, res) => {
    try {
        const {
             name,
             email,
             password,
            } = req.body
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
            password: pass,
            role: "Student"
        })
        
        res.status(201).json({
            message: "add student successfully",
            user: {
                user
            }
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const studentData =async (req, res) => {
    try {
        const user =await User.find().select("-password")
        if (user.length===0) {
            return res.status(403).json({
                message: "not any student found"
            })
        }
        res.status(201).json({
            message: "students Found",
            student: user
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const singleStd =async (req,res)=>{
    try{
        const id = req.params.id
        const user =await User.findById(id)
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        res.status(200).json({
            message :"user found",
            User:user
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const updateStd =async (req,res)=>{
    try{
        const id = req.params.id
        const {name , email } = req.body
        const user =await User.findByIdAndUpdate(id,{name,email })
        res.status(200).json({
            message:"updated",
            user
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteStd =async (req,res)=>{
    try{
        const id = req.params.id
        const delUser =await User.findByIdAndDelete(id)
        if (!delUser) {
            return res.status(404).json({
                message:"user not found"
            })
        }
        res.status(201).json({
            message:"updated",
            delUser
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
module.exports = {addStudent,studentData,singleStd ,updateStd,deleteStd}