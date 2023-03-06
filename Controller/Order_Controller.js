const Order_Schema = require('../db/Order_Schema');
const stripe = require('stripe')
class Order {
    async OrderItems(req, res) {
        try {
            let allItems = [];
            const userId = req.body.userId
            if (!userId) {
                return res.status(400).send("something missing")
            }
            const allOrders = await Order_Schema.find({ userId }).exec()
            console.log({ allOrders })
            if (allOrders.length > 0) {
                allOrders.forEach(element => {

                    allItems.push({
                        items: element.Items,
                        address: element.shipping_address,
                        deliveryStatus: element.delivery_status,
                        paymentStatus: element.payment_status,
                        phone: element.phone,
                        name: element.name,
                        amount: element.amount,
                        time: new Date().setDate(new Date().getDate() + 5)
                    })
                });
            }
            return res.status(200).json(allItems.reverse())
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
}

module.exports = new Order()