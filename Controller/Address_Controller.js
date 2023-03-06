const { isValidNum } = require("../Services/NumberValid")
const Address = require("../db/Address_Schema")
class AddressClass {
    async addAddress(req, res) {
        try {
            const { name, pincode, locality, address, city, state, mobile, userId } = req.body
            if (!name || !pincode || !locality || !address || !city || !state || !mobile || !userId) {
                console.log(req.body)
                return res.status(400).send("something missing")
            }
            if (pincode.length !== 6) {
                return res.status(400).send("pincode is wrong")
            }
            if (!isValidNum(mobile)) {
                return res.status(400).send("Invalid mobile number")
            }

            await Address.updateMany({ userId: userId }, { $set: { active: false } }, { multi: true }).exec()
            const newAddress = await Address({
                name,
                locality,
                address,
                city,
                state,
                mobile,
                pincode,
                userId,
                active: true
            })
            newAddress.save((err) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send("something error occured")
                }
                else {
                    return res.status(201).send("added")
                }
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send("somethng error occured")
        }
    }
    async AllAddress(req, res) {
        try {
            const { userId } = req.body
            if (!userId) {
                return res.status(400).json({ message: "something missing" })
            }
            const allAddress = await Address.find({ userId })
            return res.status(200).json(allAddress)
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "something error occured" })
        }
    }
    async activeAddress(req, res) {
        try {
            const { userId, addressId } = req.body
            if (!userId || !addressId) {
                return res.status(400).send("something missing")
            }
            await Address.updateMany({ $and: [{ userId }] }, { $set: { active: false } }, { multi: true }).exec()
            await Address.updateMany({ $and: [{ userId, _id: addressId }] }, { $set: { active: true } }, { multi: true }).exec()
            return res.status(200).send("update")
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }

    async removeAddress(req, res) {
        try {
            const { userId, addressId } = req.body
            if (!userId || !addressId) {
                return res.status(400).send("something missing")
            }
            await Address.deleteOne({ $and: [{ userId, _id: addressId }] }).exec()
            return res.status(200).send("deleted")
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
}


module.exports= new AddressClass()