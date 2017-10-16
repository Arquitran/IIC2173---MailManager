const mp = require('./mail-parser');
const axios = require('axios')
var mailPort = 993
var MailListener = require("mail-listener2");

var mailListener = new MailListener({
  username: "info.arquitran@gmail.com",
  password: "hansfindel",
  host: "imap.gmail.com",
  port: mailPort, // imap port
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  debug: null, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: false, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: {streamAttachments: false}, // options to be passed to mailParser lib.
  attachments: false, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
    console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
    console.log("imapDisconnected");
});

mailListener.on("error", function(err){
    console.log(err);
});

mailListener.on("mail", function(mail, seqno, attributes){
    /*email format is the following
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
    console.log("Mail received")
    mp.parseEmail(mail.text, mail.subject, mail.from[0].address, mail.from[0].name, mail.date)
});

mailListener.on("attachment", function(attachment){
    console.log(attachment.path);
});

mailListener.start();
console.log("Listening for mails at port " + mailPort);
