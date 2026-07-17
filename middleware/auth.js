const jwt = require("jsonwebtoken")

const auth = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization
        if(!authHeader){
            res.status(404).json({
                message:"token not exist"
            })
        }
        const token = authHeader.split(" ")[1]
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        req.user = decode
        next()
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
module.exports = auth