const nodemailer = require('nodemailer');

const UserEmail = process.env.USER_EMAIL;
const EmailPassword = process.env.PASSWORD_EMAIL;

async function sendMail(otp, useremail, name) {
    // Create transporter with more specific Gmail configuration
    const transporter = nodemailer.createTransport({
        host: 'gmail',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: UserEmail,
            pass: EmailPassword // This should be an App Password, not regular password
        }
    });

    // Email content with HTML formatting for better presentation
    const mailOption = {
        from: `"ShoeOne" <${UserEmail}>`,
        to: useremail,
        subject: "Account Verification for ShoeOne",
        text: `Dear ${name},

        To verify your ShoeOne account, use OTP: ${otp}

        Thank you,
        ShoeOne Team`,
        // Adding HTML version for better formatting
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Account Verification</h2>
                <p>Dear ${name},</p>
                <p>To verify your ShoeOne account, use the following OTP:</p>
                <h3 style="background: #f4f4f4; padding: 10px; text-align: center;">${otp}</h3>
                <p>Thank you,<br>ShoeOne Team</p>
            </div>
        `
    };

    try {
        // Verify connection before sending
        await transporter.verify();
        
        // Send mail
        const info = await transporter.sendMail(mailOption);
        console.log("Verification email sent successfully:", info.messageId);
        return true;
    } catch (error) {
        console.error("Email sending failed:", error.message);
        throw error; // Re-throw to handle in the calling function
    }
}

module.exports = sendMail;














// const nodemailer = require('nodemailer')




// const UserEmail = process.env.USER_EMAIL
// const EmailPassword = process.env.PASSWORD_EMAIL


// async function sendMail(otp, useremail,name) {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: UserEmail,
//             pass: EmailPassword
//         }
//     })

//     // email content
//     const mailOption = {
//         from: UserEmail,
//         to: useremail,
//         subject: "Account Verification  for ShoeOne",
//         text: `Dear ${name},

//         TO verify your ShoeOne account, use OTP: ${otp} ,

//         Thank you,
//         ShoeOne Team `
       
//     }

//     // send mail
//     try {
//         await transporter.sendMail(mailOption);
//         console.log("Verification email sent successfully");
//     } catch (error) {
//         console.log("Email sending failed", error);
//     }
// }







// module.exports =  sendMail
   
