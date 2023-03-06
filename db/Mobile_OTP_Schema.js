
const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
    mobile: String,
    userId: String,
    otp: String,
    createdAt: Date,
    expireAt: Number,
    verify: Boolean
})
module.exports = new mongoose.model("mobile_verify", Schema)