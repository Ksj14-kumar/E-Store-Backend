const OrderSchema = require("../db/Order_Schema");
const Item_Schema = require("../db/Item_Schema")
const Address = require("../db/Address_Schema")
class Util {
    async SaveOrderInDBAfterSuccessPayment(metaData, data) {
        try {
            console.log({ metaData })
            console.log({ data })
            const value = metaData.metadata.cartItems.replace(/'/g, '"')
            console.log(typeof metaData.metadata.cartItems)
            console.log({ value })
            const Items = value
            const userId = metaData.metadata.userId
            const phone = metaData.phone
            const email = metaData.email
            const customer_stripe_id = metaData.id
            const totalAmount = data.amount_subtotal / 100
            const shipping = data.customer_details.address
            const name = data.customer_details.name
            const createdAt = new Date(data.created)
            const itemsList = await Item_Schema.findOneAndDelete({ userId }).exec()
            console.log({ itemsList })
            console.log({shipping})
            await Address.updateMany({ userId: userId }, { $set: { active: false } }, { multi: true }).exec()
            const newAddress = await new Address({
                name,
                locality: shipping.line1,
                address: shipping.line2,
                city: shipping.city,
                state: shipping.state,
                mobile: phone,
                pincode: shipping.postal_code,
                userId,
                active: true
            })
            await newAddress.save()
            const saveDetails = await OrderSchema({
                userId,
                Items: itemsList.items,
                shipping_address: shipping,
                payment_status: data.payment_status,
                email,
                phone,
                stripe_customerId: customer_stripe_id,
                name,
                amount: totalAmount,
                createdAt,
                payment_intent: data.payment_intent
            })
            saveDetails.save(async (err) => {
                if (err) {
                    console.log(err)
                    return 0
                }
                else {

                    return 1
                }
            })
        } catch (err) {
            console.log(err)
            console.log("payment status not save in db")
            return 0
        }
    }
}

module.exports = new Util()