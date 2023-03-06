module.exports.isAuth= (req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    }
    else{
        return res.status(401).send("unauthorized")
    }
}