const mongoose = require("mongoose")

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database connected")
    }
    catch(error){
        console.log("❌ Database Connection Failed");
        console.log(error.message);
        process.exit(1);
    }
}
module.exports = connectDb