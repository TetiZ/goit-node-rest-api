import "dotenv/config";
import nodemailer from "nodemailer";

const { MAILER_USERNAME, MAILER_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  type: "LOGIN",
  auth: {
    user: MAILER_USERNAME,
    pass: MAILER_PASSWORD,
  },
});

function sendMail(message) {
  return transporter.sendMail(message);
}

export default { sendMail };
