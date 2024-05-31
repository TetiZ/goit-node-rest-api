import "dotenv/config";
import nodemailer from "nodemailer";

const { MAILER_USERNAME, MAILER_PASSWORD, MAIL_SENDER } = process.env;

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  type: "LOGIN",
  auth: {
    user: MAILER_USERNAME,
    pass: MAILER_PASSWORD,
  },
});

async function sendMail(email, verificationToken) {
  const message = {
    to: email,
    from: MAIL_SENDER,
    subject: "Welcome to Contacts!",
    html: `To confirm your email, please follow the <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
    text: `To confirm your email, please open the link http://localhost:3000/users/verify/${verificationToken}`,
  };
  return transport.sendMail(message);
}

export default { sendMail };
