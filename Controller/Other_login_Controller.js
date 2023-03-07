const passport= require("passport")
class Other_login {
    async googleCallback(req, res, next) {
        passport.authenticate("google", {
            failureRedirect: "/api/v1/failed",
            successRedirect: process.env.BACKEND_DOMAIN,
            successMessage: "successfull login",
            failureMessage: "not login"
        })(req, res, next)
    }
    async failed(req, res) {
        try {
            return res.send("failed")
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
}


module.exports= new Other_login()