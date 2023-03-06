const router = require("express").Router()
const { GetOTP, VerifyOTP, mobileOTP } = require("../Controller/OTP_Controller")
const {isAuth}= require("../middleware/isAuth")
router.post("/", GetOTP)
router.post("/verify", VerifyOTP)
router.post("/mobile",isAuth, mobileOTP)
module.exports = router