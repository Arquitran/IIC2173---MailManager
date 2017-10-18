// const axios = require('axios');
// WIP while queue is defined
// const url = 'http://httpbin.org/post';

const sender = require('./mail-sender');
const http = require('http');

function getResponse(jsonRes) {
  const baseUrl = process.env.QUEUE_URL || 'http://arqss14.ing.puc.cl';

  let url = `${baseUrl}/mail`;
  switch (jsonRes.action) {
    case 'view':
      url += `${url}/productos`;
      break;
    case 'category':
      url += `${url}/categorias`;
      break;
    default:
  }
  http.get(url, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
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
      } else {
        continue;
      }
      // Axios is a temporary solution until the queue is chosen
      // axios.post(url, jsonB)
      //   .then((response) => {
      //     console.log(response.data);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      getResponse(jsonB);
    }
  },
};
