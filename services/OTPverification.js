const nodemailer = require('nodemailer')




const UserEmail = process.env.USER_EMAIL
const EmailPassword = process.env.PASSWORD_EMAIL


async function sendMail(otp, useremail,name) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: UserEmail,
            pass: EmailPassword
        }
    })

    // email content
    const mailOption = {
        from: UserEmail,
        to: useremail,
        subject: "Account Verification  for ShoeOne",
        text: `Dear ${name},

        TO verify your ShoeOne account, use OTP: ${otp} ,

        Thank you,
        ShoeOne Team `
       
    }

    // send mail
    try {
        await transporter.sendMail(mailOption);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.log("Email sending failed", error);
    }
}







module.exports =  sendMail
   
