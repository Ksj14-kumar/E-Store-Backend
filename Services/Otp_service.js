const crypto = require("crypto")
const { sendMail } = require("../Config/nodeMailer")
const { Sms } = require("../Config/Sms")
class OTP_Service {
    async get_otp() {
        const otp = crypto.randomInt(1000, 9999)
        return otp
    }
    async send_OTP_by_email(email, otp) {
        const result = await sendMail(email, otp)
        console.log({ result })
        return result
    }
    async send_OTP_by_Mobile(mobile, otp) {
        const result = await Sms(mobile, otp)
        if (result) {
            return true
        }
        else {
            return false
        }
    }
}

module.exports = new OTP_Service()