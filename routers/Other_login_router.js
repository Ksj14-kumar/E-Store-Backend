const router = require("express").Router()
const passport = require("passport")
const { googleCallback, failed } = require("../Controller/Other_login_Controller")
router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", googleCallback)
router.get("/api/v1/failed", failed)

module.exports = router