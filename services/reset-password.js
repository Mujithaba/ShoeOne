const nodemailer = require('nodemailer')




const UserEmail = process.env.USER_EMAIL
const EmailPassword = process.env.PASSWORD_EMAIL


async function sendMailForgot(otp, useremail,name) {
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
        subject: "Forgot Password Set Up   For ShoeOne Account",
        text: `Dear ${name},

        TO set  your ShoeOne account Forgotpassword, 
        use OTP: ${otp} ,

    
        ShoeOne Team `
       
    }

    // send mail
    try {
        await transporter.sendMail(mailOption);
        console.log("Verification forgot password email sent successfully");
    } catch (error) {
        console.log("Forgot password email sending failed", error);
    }
}







module.exports =  sendMailForgot
   
