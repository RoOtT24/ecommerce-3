import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to,subject,html) {

  let transporter = nodemailer.createTransport({
    service:'gmail',
    secure: true,
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `Ecommerce-3 " <${process.env.EMAIL}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
}
