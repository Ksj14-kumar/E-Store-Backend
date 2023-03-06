const Address = require("../db/Address_Schema")
const { isValidNum } = require("../Services/NumberValid")
class Socket {
    async AddAddress(params,socket) {
        let message={}
        try {
            const { name, pincode, locality, address, city, state, mobile, userId } = params
            if (!name || !pincode || !locality || !address || !city || !state || !mobile || !userId) {
                message.msg="something missing"
                message.status=404
            }
            if (pincode.length !== 6) {
                message.msg= "pincode is wrong"
                message.status=404
            }
            if (!isValidNum(mobile)) {
                message.msg="Invalid mobile number"
                message.status=404
            }
            else{
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
                newAddress.save(async(err) => {
                    if (err) {
                        console.log(err)
                        message.msg="someting error occured" 
                        message.status=404
                    }
                    else {
                        const allAddress= await Address.find({ userId: userId }).exec()
                        console.log({allAddress})
                        message.msg= allAddress
                        message.status=200
                    }
                    socket.emit("message",message)
                })
            }
        } catch (err) {
            console.log(err)
            socket.emit("message",{msg:"something error occured",status:500})
        }
    }
}
module.exports = new Socket()