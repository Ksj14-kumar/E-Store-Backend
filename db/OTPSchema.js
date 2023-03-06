const { default: mongoose } = require("mongoose");
const OtpSchema = new mongoose.Schema({
    userId: String,
    createdAt: Date,
    expireAt: Number,
    otp: String,
    email:String
})
module.exports = new mongoose.model("otp", OtpSchema)