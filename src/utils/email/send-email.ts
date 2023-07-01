import nodemailer from 'nodemailer';

const getMailSettings = () => ({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  //secureConnection: false,
  secure: process.env.MAIL_PORT + '' === '465', // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

let mailSettings = undefined;
let transporter = undefined;

const SendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
) => {
  if (!transporter) {
    mailSettings = getMailSettings();
    transporter = nodemailer.createTransport(mailSettings);
  }

  const fromEmail = process.env.MAIL_FROM
    ? process.env.MAIL_FROM
    : mailSettings.auth.user;
  const from = `"BETALIFE" <${fromEmail}>`;

  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};

export default SendEmail;
