const nodeMailer = require("nodemailer")
module.exports.sendMail = async (email, otp) => {
    try {
        const transport = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_MAIL,
                pass: process.env.SENDER_MAIL_PASSWORD
            }
        },
        )
        // send mail with defined transport object
        let info = await transport.sendMail({
            from: process.env.SENDER_MAIL, // sender address
            to: email, // list of receivers
            subject: "verify Email from Store.Com", // Subject line
            text: `verify Email from ${process.env.BACKEND_DOMAIN}`, // plain text body
            html: `<p>your OTP is <b> ${otp}</b>  for ${process.env.BACKEND_DOMAIN}</p>`, // html body
        });
        console.log({ info })
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
        return 1
    } catch (err) {
        console.log(err)
        return 0
    }
}