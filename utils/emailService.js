const nodemailer = require('nodemailer');

// // Create a test account if you don't have a real email service configured
// let transporter;

// async function createTestAccount() {
//   let testAccount = await nodemailer.createTestAccount();
  
//   transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });
// }

// createTestAccount();

// If you have a real email service, use this configuration instead:
const transporter = nodemailer.createTransport({
  service: 'gmail',  // or your email service
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: 'ghoshsachin2301@gmail.com',
    pass: 'acvxzuznmyffnsgf'
  }
});

exports.sendEmail = async (to, subject, text) => {
  try {
    let info = await transporter.sendMail({
      from: '"RecruitersNest" <noreply@recruitersnest.com>',
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};