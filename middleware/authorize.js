const auth = require("./auth")

const authorize = (...role)=>{
    return (req,res,next)=>{
        try{
            if(!role.includes(req.user.role)){
            res.status(404).json({
                message:"unauthorized access"
            })
        }
        next()
        }
        catch(error){
            res.status(500).json({
                message:error.message
            })
        }
    }
}
module.exports = authorize