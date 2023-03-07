const router = require("express").Router()
const { Static_404, Profile } = require("../Controller/Static_Files")
const { isAuth } = require("../middleware/isAuth")
router.get("/404",Static_404)
router.get("/profile",isAuth,Profile)

module.exports = router