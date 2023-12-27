const nodemailer = require('nodemailer')




const UserEmail = process.env.USER_EMAIL
const EmailPassword = process.env.PASSWORD_EMAIL

// reset password to send email 

async function sendResetPasswordMail(token, useremail,name) {
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
        subject: "For Reset Password",
        html: `<p>Hi ${name}, 
        please click here  to <a href="http://localhost:3000/forgetPassword?token=${token}">Reset</a></p>`
       
    }

    // send mail
    try {
        await transporter.sendMail(mailOption);
        console.log("Verification email sent successfully for change password");
    } catch (error) {
        console.log("Email sending failed", error);
    }
}


module.exports = sendResetPasswordMail