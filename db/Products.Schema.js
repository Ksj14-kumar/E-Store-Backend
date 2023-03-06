const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    rating: {
        rate: Number,
        count: Number
    }
})
module.exports = new mongoose.model("products", Schema)