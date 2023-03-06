const User = require("../db/UserSchema")
const { isValidEmail } = require("../Services/EmailValid")
const { isValidPass } = require("../Services/isValidPass")
const passport = require("passport")
const { get_otp, send_OTP_by_email } = require("../Services/Otp_service")
const UserSchema = require("../db/UserSchema")
const OTPDB = require("../db/OTPSchema")
const bcrypt = require("bcrypt")
const path = require("path")
class Info_Class {
    async Register(req, res) {
        try {
            const userInfo = req.body
            if (!userInfo.name || !userInfo.lname || !userInfo.email || !userInfo.password) {
                return res.status(400).json({ message: "missing" })
            }
            if (!isValidEmail(userInfo.email)) {
                return res.status(400).json({ message: "Invalid email" })
            }

            if (!isValidPass(userInfo.password)) {
                return res.status(400).json({ message: "Invalid password format" })
            }
            console.log({ userInfo })

            const isalready = await User.findOne({ email: userInfo.email }).exec()
            if (isalready && isalready.verify) {
                return res.status(400).json({ message: "user already register" })
            }
            await User.findOneAndDelete({ email: userInfo.email }).exec()
            const savenewUser = await User({
                verify: false,
                name: userInfo.name.trim(),
                lname: userInfo.lname.trim(),
                password: await bcrypt.hashSync(userInfo.password, 16),
                email: userInfo.email.trim().toLowerCase(),
                image: path.join(__dirname, "../Images", "avatar.png"),
                provider:"_self"
            })
            savenewUser.save(async (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ message: "not register" })
                }
                else {
                    console.log(result)
                    const otp = await get_otp()
                    const saveOTPInDB = await OTPDB({
                        userId: result._id,
                        email: userInfo.email,
                        createdAt: new Date(),
                        expireAt: new Date().getTime() + 540000,
                        otp: await bcrypt.hashSync(`${otp}`, 16)
                    })
                    await saveOTPInDB.save()
                    const responseAfterSendMail = await send_OTP_by_email(userInfo.email, otp)
                    if (responseAfterSendMail) {
                        return res.status(201).json({ message: "OTP has been sent to email", userId: result._id })
                    }
                    else {
                        return res.status(500).json({ message: "something error occured" })
                    }
                }
            })
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occurred")
        }
    }
    async updateUser(req, res) {

        try {
            const userInfo = req.body
            if (!userInfo.status || !userInfo.userId) {
                return res.status(400).send("something missing")
            }
            else if (userInfo.status === 3 && (userInfo.name && userInfo.lname)) {
                const userInfoUpdate = await User.findOneAndUpdate({ _id: userInfo.userId }, { $set: { name: userInfo.name, lname: userInfo.lname } }).exec()
                console.log({ userInfoUpdate })
                return res.status(200).send("update")
            }
            else if (userInfo.status === 4 && userInfo.gender) {
                const userInfoUpdate = await User.findOneAndUpdate({ _id: userInfo.userId }, { $set: { gender: userInfo.gender } }).exec()
                console.log({ userInfoUpdate })
                return res.status(200).send("update")
            }
            else {
                return res.status(400).send("something error")
            }
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occurred")
        }
    }

    async Info(req, res) {
        try {
            const userId = req.body.userId
            if (!userId) {
                return res.status(400).send("something missing");
            }
            const result = await UserSchema.findOne({ _id:userId }).exec()
            return res.status(200).send(result.name + " " + result.lname)
        } catch (err) {
            console.log(err)
            return res.status(5000).send("something error occured")
        }
    }

    async Login(req, res, next) {
        passport.authenticate("local", (err, user, info) => {
            if (err) throw err;
            if (!user) res.status(404).send("No User Exists");
            else {
                req.logIn(user, (err) => {
                    if (err) throw err;
                    console.log(req.user);
                    res.status(200).send(process.env.UI_URL);
                });
            }
        })(req, res, next);
    }
    async onLogout(req, res) {
        try {
            req.logOut(function (err) {
                if (err) {
                    return next()
                }
                return res.sendStatus(200)
            })
        }
        catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }

    async Success(req, res) {
        console.log("user is")
        console.log(req._passport.session)
        console.log(req.user)
        if (req.isAuthenticated()) {
            return res.status(200).json({ image: req.user.image, _id: req.user._id, isAuth: true })
        }
        else {
            return res.sendStatus(401)
        }
    }

}
module.exports = new Info_Class()