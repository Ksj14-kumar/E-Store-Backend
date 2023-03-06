const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
    lname: String,
    name: String,
    verify: Boolean,
    password: String,
    email: String,
    image:String,
    provider:String
})
module.exports = new mongoose.model("ecommerce_users", Schema)