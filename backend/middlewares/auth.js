const jwt = require("jsonwebtoken")
const env = require('dotenv').config()

const auth = async (req,res,next) =>{
    try{
        const authheader = req.headers.authorization
        if(!authheader) return res.json({message : "No Token Provided"})

        const [bearer,token] = authheader.split(' ')
        if(!token) return res.json({message : "Invalid Token Format"})

        let decoded = await jwt.verify(token,process.env.SECRET_KEY)
        req.user = decoded
        next()
    }catch(err){
        res.json({message : "Invalid or Expired Token"})
    }
}

module.exports = auth
