const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'info.arquitran@gmail.com', // Your email id
    pass: 'hansfindel', // Your password
  },
});

const text = 'Hello world';

const mailOptions = {
  from: 'info.arquitran@gmail.com', // sender address
  to: 'fjvaldes1@uc.cl', // list of receivers
  subject: 'Email Example', // Subject line
  text, //
  // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
    // res.json({yo: 'error'});
  } else {
    console.log(`Message sent: ${info.response}`);
    // res.json({yo: info.response});
  }
});

module.exports = async function()
