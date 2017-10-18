const MailListener = require('mail-listener2');
const http = require('http');
const mp = require('./mail-parser');
const sender = require('./mail-sender');

const mailPort = 993;
const config = {
  username: 'info.arquitran@gmail.com',
  password: 'hansfindel',
  host: 'imap.gmail.com',
  port: mailPort, // imap port
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  debug: null, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: 'INBOX', // mailbox to monitor
  searchFilter: ['UNSEEN'], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: false, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: { streamAttachments: false }, // options to be passed to mailParser lib.
  attachments: false, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: 'attachments/' }, // specify a download directory for attachments
};

const mailListener = new MailListener(config);

mailListener.on('server:connected', () => {
  console.log('imapConnected');
});

mailListener.on('server:disconnected', () => {
  console.log('imapDisconnected');
});

mailListener.on('error', (err) => {
  console.log(err);
});

mailListener.on('mail', (mail, seqno, attributes) => {
  /* email format is the following
    {
        text: main email body
        subject: email subject
        from: [
            {
                address: email sender adress
                name: email sender name
            }
        ]
        date: timestamp when sent
    }
    there's other stuff but it's metadata/not relevant
    */
  console.log('Mail received');
  const parsedJson = mp.parseEmail(
    mail.text,
    mail.subject,
    mail.from[0].address,
    mail.from[0].name,
    mail.date,
  );

  let url = `${process.env.QUEUE_URL}/mail`;
  switch (parsedJson.action) {
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
        mail.from[0].address,
        mail.from[0].name,
      );
    });
  }).on('error', (err) => {
    console.log(`Error: ${err.message}`);
  });
});

mailListener.on('attachment', (attachment) => {
  console.log(attachment.path);
});

mailListener.start();
console.log(`Listening for mails at port ${mailPort}`);
