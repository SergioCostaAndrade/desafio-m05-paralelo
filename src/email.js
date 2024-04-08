const nodemailer = require("nodemailer");
//const transportador = nodemailer.createTransport({
//  host: process.env.EMAIL_HOST,
//  port: process.env.EMAIL_PORT,
//  auth: {
//    user: process.env.EMAIL_USER,
//    pass: process.env.EMAIL_PASS,
//  },
//});
const transportador = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c89d56e060f54f",
    pass: "d3900dc18ef60f",
  },
});

module.exports = transportador;
