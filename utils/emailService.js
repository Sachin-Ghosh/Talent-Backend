const nodemailer = require('nodemailer');

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