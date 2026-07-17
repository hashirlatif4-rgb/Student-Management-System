const express = require("express")
const stdRouter = express.Router()
const {addStudent,studentData, updateStd,deleteStd,singleStd}=require("../controller/student")
const authorize = require("../middleware/authorize")
const auth = require("../middleware/auth")

stdRouter.post("/student" , auth ,authorize("Admin", "Teacher") , addStudent )
stdRouter.get("/students" , auth , authorize("Admin" ,"Teacher" ) , studentData)
stdRouter.get("/students/:id" , auth , authorize("Admin","Teacher") , singleStd)
stdRouter.put("/update/:id" , auth , authorize("Admin","Teacher") , updateStd )
stdRouter.delete("/delete/:id" , auth , authorize("Admin",) , deleteStd )

module.exports = stdRouter
