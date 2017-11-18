const MailListener = require('mail-listener2');
const mp = require('./mail-parser');

const mailPort = 993;
const config = {
  username: 'info.arquitran@gmail.com',
  password: 'hansfindel',
  host: 'imap.gmail.com',
  port: mailPort,
  tls: true,
  connTimeout: 10000,
  authTimeout: 5000,
  debug: null,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: 'INBOX', // mailbox to monitor
  searchFilter: ['UNSEEN'],
  markSeen: true,
  fetchUnreadOnStart: false,
  mailParserOptions: { streamAttachments: false },
  attachments: false,
  attachmentOptions: { directory: 'attachments/' },
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

  console.log('Mail received');
  mp.parseEmail(
    mail.text,
    mail.subject,
    mail.from[0].address,
    mail.from[0].name,
    mail.date,
  );
});

mailListener.on('attachment', (attachment) => {
  console.log(attachment.path);
});

mailListener.start();
console.log(`Listening for mails at port ${mailPort}`);
