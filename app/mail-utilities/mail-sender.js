const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'info.arquitran@gmail.com',
    pass: 'hansfindel',
  },
});


module.exports = function sendMail(req, address, name) {
  const text = JSON.stringify(req);
  const mailOptions = {
    from: 'info.arquitran@gmail.com',
    to: address,
    subject: 'Respuesta Arquitran',
    // text: req.body.text,
    text,
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      // res.end('error');
    } else {
      console.log(`Message sent: ${response.message}`);
      // res.end('sent');
    }
  });
};
