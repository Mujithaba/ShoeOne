const nodemailer = require('nodemailer');
const UserEmail = process.env.USER_EMAIL;
const EmailPassword = process.env.PASSWORD_EMAIL;

async function sendMail(otp, useremail, name) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',  // Changed from 'gmail' to 'smtp.gmail.com'
        port: 465,
        secure: true,
        auth: {
            user: UserEmail,
            pass: EmailPassword
        }
    });

    const mailOption = {
        from: `"ShoeOne" <${UserEmail}>`,  // Changed from PASSWORD_EMAIL to UserEmail
        to: useremail,
        subject: "Account Verification for ShoeOne",
        text: `Dear ${name},
        To verify your ShoeOne account, use OTP: ${otp}
        Thank you,
        ShoeOne Team`,
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
        throw error;
    }
}

module.exports = sendMail;







// const nodemailer = require('nodemailer');

// const UserEmail = process.env.USER_EMAIL;
// const EmailPassword = process.env.PASSWORD_EMAIL;

// async function sendMail(otp, useremail, name) {
//     // Create transporter with more specific Gmail configuration
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true, // use SSL
//         auth: {
//             user: process.env.USER_EMAIL,
//             pass: process.env.PASSWORD_EMAIL
//         }
//     });

//  // Verify connection configuration
//  try {
//     await transporter.verify();
//     console.log('SMTP connection verified');
// } catch (error) {
//     console.error('SMTP verification failed:', error);
//     throw error;
// }

// const mailOption = {
//     from: `"ShoeOne" <${process.env.USER_EMAIL}>`,
//     to: useremail,
//     subject: "Account Verification for ShoeOne",
//     html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px;">
//             <h2>Account Verification</h2>
//             <p>Dear ${name},</p>
//             <p>Your OTP for ShoeOne account verification is:</p>
//             <h3 style="background: #f4f4f4; padding: 10px; text-align: center;">${otp}</h3>
//             <p>Thank you,<br>ShoeOne Team</p>
//         </div>
//     `
// };

// try {
//     const info = await transporter.sendMail(mailOption);
//     console.log("Email sent successfully:", info.messageId);
//     return true;
// } catch (error) {
//     console.error("Email sending failed:", error);
//     throw error;
// }
// }

// module.exports = sendMail;













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
   
