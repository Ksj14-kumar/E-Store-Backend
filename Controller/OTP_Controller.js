const OTP_Service = require("../Services/Otp_service")
const OTPDB = require("../db/OTPSchema")
const UserSchema = require("../db/UserSchema")
const bcrypt = require("bcrypt")
const { isValidEmail } = require("../Services/EmailValid")
const { isValidNum } = require("../Services/NumberValid")
const MobileSchema = require("../db/Mobile_OTP_Schema")
class OTP_Class {
    async GetOTP(req, res) {
        try {
            const { email, userId } = req.body
            if (!email || !userId) {
                return res.status(400).send("something missing")
            }
            console.log(req.body)
            if (!isValidEmail(email)) {
                return res.status(400).send("invalid email")
            }
            const isAlredyVerify = await UserSchema.findOne({ $or: [{ email: email }, { _id: userId }] }).exec()
            console.log({ isAlredyVerify })
            if (!isAlredyVerify) {
                return res.status(400).send("user not register")
            }
            if (isAlredyVerify && (isAlredyVerify.verify && isAlredyVerify.email === email)) {
                return res.status(200).send("email already verify")
            }
            const newOTP = await OTP_Service.get_otp()
            //delete preious otps
            await OTPDB.deleteMany({ $and: [{ email, userId }] }).exec()
            const saveOTPInDB = await OTPDB({
                userId,
                email,
                createdAt: new Date(),
                expireAt: new Date().getTime() + 54000,
                otp: await bcrypt.hashSync(`${newOTP}`, 16)
            })
            saveOTPInDB.save(async (err) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send("something error occured")
                }
                else {
                    const result = await OTP_Service.send_OTP_by_email(email, newOTP)
                    console.log({ result })
                    if (result) {
                        return res.status(200).send("OTP has been send to Email")
                    }
                    return res.status(500).send("email not send something error occured")
                }
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }

    async VerifyOTP(req, res) {
        try {
            const { otp, userId, email } = req.body
            console.log({ otp })
            if (!userId || !email) {
                return res.status(400).send("something missing")
            }
            if (!otp || otp.length !== 4) {
                return res.status(400).send("Invalid OTP")
            }
            const getOTPFromDB = await OTPDB.findOne({ $and: [{ email, userId }] }).exec()
            console.log({ getOTPFromDB })
            if (!getOTPFromDB) {
                return res.status(400).send("Invalid OTP")
            }
            const OTPFromDB = getOTPFromDB.otp
            const { expireAt } = getOTPFromDB

            const isSame = await bcrypt.compare(otp, OTPFromDB)
            console.log({ isSame })
            if (isSame) {
                //otp has been expires or not
                if (expireAt < new Date().getTime()) {
                    //delete all previous otp
                    await OTPDB.deleteMany({ $and: [{ email, userId }] }).exec()
                    return res.status(400).send("OTP has been expires")
                }
                else {
                    //otp success, replace email and delete otp
                    const result = await UserSchema.findOneAndUpdate({ _id: userId }, { $set: { email: email, verify: true } }, { multi: true, upsert: true, new: true }).exec()
                    console.log({ result })
                    await OTPDB.deleteMany({ $and: [{ email, userId }] })
                    return res.status(200).send("Email has been verify")
                }

            }
            else {
                console.log("mismatch data type")
                return res.status(400).send("Invalid OTP")
            }
        } catch (err) {
            console.log(err)
            return res.status(500).send("someting error ocurred")
        }
    }
    async mobileOTP(req, res) {
        try {
            const { userId, mobile } = req.body
            if (!userId || !mobile) {
                return res.status(400).send('something missing')
            }
            if (mobile.length !== 10 || !isValidNum(mobile)) {
                return res.status(400).send("Invalid mobile number")
            }
            await MobileSchema.deleteMany({ userId }).exec()
            const newOTP = await OTP_Service.get_otp()
            const newMobileOTP = await MobileSchema({
                mobile: mobile,
                userId: userId,
                otp: newOTP,
                createdAt: Date.now(),
                expireAt: new Date().getTime(),
                verify: false
            })
            newMobileOTP.save(async (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send("something error occured")
                }
                else {
                    const sendSMS = await OTP_Service.send_OTP_by_Mobile(mobile, newOTP)
                    if (sendSMS) {
                        return res.status(200).send("OTP has been sent to mobile")
                    }
                    else {
                        return res.status(500).send("something error occured")
                    }
                }
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send("something error")
        }
    }
}

module.exports= new OTP_Class()