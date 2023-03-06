const { default: mongoose } = require("mongoose");
const ItemSchema = new mongoose.Schema({
    userId:String,
    items: [Object],
    totalItems: Number,
    totalAmount: Number
})
module.exports = new mongoose.model("items", ItemSchema)