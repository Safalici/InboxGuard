const express = require('express');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to fetch emails via IMAP
app.post('/fetch-emails', (req, res) => {
  const { email, password, imapServer, imapPort } = req.body;

  const imap = new Imap({
    user: email,
    password: password,
    host: imapServer,
    port: imapPort,
    tls: true,
  });

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  imap.once('ready', function () {
    openInbox(function (err, box) {
      if (err) throw err;
      const fetch = imap.search(['ALL'], (err, results) => {
        if (err) throw err;
        const f = imap.fetch(results, { bodies: '' });
        let emails = [];

        f.on('message', function (msg, seqno) {
          msg.on('body', function (stream, info) {
            simpleParser(stream, (err, parsed) => {
              if (err) throw err;

              const emailData = {
                sender: parsed.from.text,
                recipient: parsed.to.text,
                subject: parsed.subject,
                body: parsed.text,
                timestamp: parsed.date,
              };

              emails.push(emailData);
            });
          });
        });

        f.once('end', function () {
          imap.end();
          res.json({ emails });
        });
      });
    });
  });

  imap.once('error', function (err) {
    console.log(err);
    res.status(500).json({ error: 'Error fetching emails' });
  });

  imap.once('end', function () {
    console.log('Connection closed');
  });

  imap.connect();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
