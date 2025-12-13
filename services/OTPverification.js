const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const UserEmail = process.env.USER_EMAIL;
const EmailPassword = process.env.PASSWORD_EMAIL;

async function sendMail(otp, userEmail, name) {
  try {
    // ✅ FIXED: Use port 587 instead of 465
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Changed from 465
      secure: false, //  Changed from true (use STARTTLS instead of SSL)
      auth: {
        user: UserEmail,
        pass: EmailPassword,
      },
      // Add timeout settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify connection
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // Email content
    const mailOptions = {
      from: `"ShoeOne" <${UserEmail}>`,
      to: userEmail,
      subject: "Account Verification for ShoeOne",
      text: `Dear ${name}, To verify your ShoeOne account, use OTP: ${otp}. Thank you, ShoeOne Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Account Verification</h2>
          <p>Dear ${name},</p>
          <p>To verify your ShoeOne account, use the following OTP:</p>
          <h1 style="background: #f4f4f4; padding: 20px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p>Thank you,<br>ShoeOne Team</p>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    console.error("Error code:", error.code);
    throw error;
  }
}

module.exports = sendMail;











// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

// // Load environment variables
// dotenv.config();

// const UserEmail = process.env.USER_EMAIL; // Gmail address
// const EmailPassword = process.env.PASSWORD_EMAIL; // Gmail App Password

// /**
//  * Send OTP email to a user
//  * @param {string} otp - One Time Password
//  * @param {string} userEmail - Recipient email
//  * @param {string} name - Recipient name
//  */
// async function sendMail(otp, userEmail, name) {
//   try {
//     // Create transporter for Gmail
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465, // SSL port
//       secure: true, // use SSL
//       auth: {
//         user: UserEmail,
//         pass: EmailPassword,
//       },
//     });

//     // Verify connection before sending
//     await transporter.verify();
//     console.log("SMTP connection verified successfully");

//     // Email content
//     const mailOptions = {
//       from: `"ShoeOne" <${UserEmail}>`,
//       to: userEmail,
//       subject: "Account Verification for ShoeOne",
//       text: `Dear ${name},

// To verify your ShoeOne account, use OTP: ${otp}

// Thank you,
// ShoeOne Team`,
//       html: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px;">
//                     <h2>Account Verification</h2>
//                     <p>Dear ${name},</p>
//                     <p>To verify your ShoeOne account, use the following OTP:</p>
//                     <h3 style="background: #f4f4f4; padding: 10px; text-align: center;">${otp}</h3>
//                     <p>Thank you,<br>ShoeOne Team</p>
//                 </div>
//             `,
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Verification email sent successfully:", info.messageId);
//     return true;
//   } catch (error) {
//     console.error("Email sending failed:", error.message);
//     throw error;
//   }
// }

// module.exports = sendMail;
