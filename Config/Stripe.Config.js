const User = require("../db/UserSchema")

class Stripe_Payment_Gateway {
    async Stripe_Payment(stripe, formatListItem, shipAddress, userId,CartItems) {
        console.log("stripe hooks call")
        const createCustomerWithMetaData= await stripe.customers.create({
            metadata:{
                userId:userId.toString(),
                cartItems:CartItems.toString()
            }
        })
        const res = await stripe.checkout.sessions.create({
            shipping_address_collection: { allowed_countries: ["IN"] },
            phone_number_collection: {
                enabled: true,
            },
            billing_address_collection: "required",
            customer:createCustomerWithMetaData.id,
            line_items: formatListItem,
            mode: 'payment',
            success_url: `${process.env.UI_URL}/success_payment`,
            cancel_url: `${process.env.UI_URL}/failure`,
        });
        console.log({ res })
        return res

    }
}

module.exports = new Stripe_Payment_Gateway()
