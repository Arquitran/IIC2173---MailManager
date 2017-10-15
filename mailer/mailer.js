var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'info.arquitran@gmail.com', // Your email id
        pass: 'hansfindel' // Your password
    }
});

var text = 'Hello world';

var mailOptions = {
    from: 'info.arquitran@gmail.com', // sender address
    to: 'fjvaldes1@uc.cl', // list of receivers
    subject: 'Email Example', // Subject line
    text: text //
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        //res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        //res.json({yo: info.response});
    };
});
