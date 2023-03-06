const { default: mongoose, mongo } = require("mongoose");


const Schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    Items: [Object],
    shipping_address: {
        type: Object,
        required: true
    },
    delivery_status: {
        type: String,
        default: "Pending"
    },
    payment_status: {
        type: String,
        default: String,
        required: true
    },
    email: {
        type: String
    },
    phone: String,
    stripe_customerId: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    payment_intent: {
        type: String,
    },
    createdAt: Date


})
module.exports = new mongoose.model("orders", Schema)