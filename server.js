const express = require('express');
const bodyParser = require('body-parser');
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

app.use('/api', router);

app.listen(port);
console.log(`Listening on port ${port}`);
