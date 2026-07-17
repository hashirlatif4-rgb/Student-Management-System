require("dotenv").config();
const express = require("express")
const dns=require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])
const app = express()
const authRouter=require("./route/authRoute")
const stdRouter = require("./route/student")
const connectDb = require("./config/db")
require("./config/db")

connectDb()
app.use(express.json())

app.use("/" , authRouter)
app.use("/" , stdRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT , ()=>{
    console.log(`server is run on port : ${PORT}`)
})