const express = require("express")
const authRouter = express.Router()
const {signUp , logIn ,profile, ForgotPassword, resetPassword ,uploads } = require("../controller/auth")
const {addStudent,studentData, updateStd,deleteStd}=require("../controller/student")
const authorize = require("../middleware/authorize")
const auth = require("../middleware/auth")
const upload = require("../middleware/upload")

authRouter.post("/signUp" , signUp)
authRouter.post("/logIn" , logIn)
authRouter.get("/profile" , auth , profile )
authRouter.post("/forgotPassword" , ForgotPassword)
authRouter.post("/resetPassword/:resetToken" , resetPassword)
authRouter.post("/uploadImage/:id" , upload.array("image" , 5),uploads)

module.exports =authRouter