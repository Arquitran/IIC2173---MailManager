const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const ml = require('./app/mail-utilities/mail-listener.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const router = express.Router();

router.get('/', (req, res) => {
  console.log(req);
  res.json({ message: 'Test' });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: 'info.arquitran@gmail.com',
    pass: 'hansfindel',
  },
});

router.post('/send',function(req,res){
    var mailOptions={
        from: 'info.arquitran@gmail.com',
        to : req.body.to,
        subject : 'Respuesta Arquitran',
        text : req.body.text
    }

    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
    });
});

app.use('/api', router);

app.listen(port);
console.log(`Listening on port ${port}`);
