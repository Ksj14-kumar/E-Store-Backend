const { default: mongoose } = require("mongoose");
const Schema = new mongoose.Schema({
    name: String,
    locality: String,
    pincode: String,
    address: String,
    city: String,
    state: String,
    mobile: String,
    userId: String,
    active: Boolean
})
module.exports = new mongoose.model("address", Schema)