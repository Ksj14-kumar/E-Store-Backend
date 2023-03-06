module.exports.ErrorMiddleware = (err, req, res, next)=>{
    if (err) {
        console.log(err)
        return res.status(500).send("something error occured")
    }
    else {
        next()
    }
}