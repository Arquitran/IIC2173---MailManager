const sender = require('./mail-sender');
const http = require('http');

function getResponse(jsonRes) {
  //let baseUrl = process.env.QUEUE_URL || 'http://arqss14.ing.puc.cl';
  let baseUrl = 'http://arqss17.ing.puc.cl';
  baseUrl += ':3000';
  let url = baseUrl;
  let apiUrl = 'https://arqss4.ing.puc.cl/api';
  console.log(jsonRes.action);
  switch (jsonRes.action) {
    case 'view':
      url = `${url}/productos`;
      break;
    case 'buy':
      url = `${apiUrl}/cart`;
      break;
    case 'category':
      url = `${url}/categorias`;
      break;
    case 'signup':
      url = `${apiUrl}/signup`;
      break;
    case 'signin':
      url = `${apiUrl}/signin`;
      break;
    default:
  }
  console.log(url);

  http.post(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log(data);
      sender(
        JSON.parse(data),
        jsonRes.user,
      );
    });
  }).on('error', (err) => {
    console.log(`Error: ${err.message}`);
  });
}

module.exports = {
  parseEmail(body, subject, email, name, date) {

    //console.log(body);
    console.log(body);
    const u0 = body.split('\n');
    console.log(u0);
    const ul = u0[0].split(/\s+/);
    console.log(ul);
    console.log(ul[0]);
    
    // Receive extra information in case it's needed in the future
    const t0 = body.split('\n');
    let jsonB;
    for (let i = 0; i < t0.length - 1; i += 1) {
      const tl = t0[i].split(/\s+/);
      if (tl[0] === 'buy') {
        jsonB = {
          action: 'buy',
          product: tl[1],
          ammount: tl[2],
          user: email,
        };
      } else if (tl[0] === 'view') {
        jsonB = {
          action: 'view',
          product: tl[1],
          user: email,
        };
      } else if (tl[0] === 'category') {
        jsonB = {
          action: 'category',
          product: tl[1],
          user: email,
        };
      } else if (tl[0] === 'signup') {
        jsonB = {
          action: 'signup',
          password: tl[1],
          user: email,
        };
      } else if (tl[0] === 'signin') {
        jsonB = {
          action: 'signin',
          password: tl[1],
          user: email,
        };
      } else {
        sender('Comando inválido', email);
        continue;
      }
      console.log(jsonB)
      getResponse(jsonB);
    }
  },
};
