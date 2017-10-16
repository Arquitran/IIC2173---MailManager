var express    = require('express');    
var app        = express();
var bodyParser = require('body-parser');
var ml = require('./app/mail-utilities/mail-listener.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;       

var router = express.Router();

router.get('/', function(req, res) {
    console.log(req)
    res.json({ message: 'Test' });   
});

app.use('/api', router);

app.listen(port);
console.log('Listening on port ' + port);

