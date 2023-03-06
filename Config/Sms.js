const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);
module.exports.Sms = async (mobile, otp) => {
    try {
        const res = await client.messages.create({
                body: `your OTP is ${otp} from ${process.env.BACKEND_DOMAIN}`,
                to: `+91${mobile}`, // Text this number
                from: process.env.Mobile_Num_for_twilio, // From a valid Twilio number
            })
        console.log({ res })
        return 1
    } catch (err) {
        console.log(err)
        return 0
    }
}