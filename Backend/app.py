from flask import Flask, request, jsonify
import imaplib
import email
from email.header import decode_header
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

def check_inbox(username, password, imap_server, num_emails=10):
    try:
        mail = imaplib.IMAP4_SSL(imap_server)
        mail.login(username, password)
        mail.select('inbox')

        status, messages = mail.search(None, 'ALL')
        email_ids = messages[0].split()
        email_ids = email_ids[-num_emails:]

        emails = []
        for email_id in reversed(email_ids):
            status, msg_data = mail.fetch(email_id, '(RFC822)')
            msg = email.message_from_bytes(msg_data[0][1])

            # Handle None value for "From" header
            from_header = msg.get('From')
            if from_header is None:
                from_header = "Unknown Sender"
            else:
                from_header, encoding = decode_header(from_header)[0]
                if isinstance(from_header, bytes):
                    from_header = from_header.decode(encoding if encoding else 'utf-8')

            # Handle None value for "Subject" header
            subject = msg.get('Subject')
            if subject is None:
                subject = "No Subject"
            else:
                subject, encoding = decode_header(subject)[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(encoding if encoding else 'utf-8')

            # Handle the message body and date
            body = msg.get_payload(decode=True)
            if body is None:
                body = "No Content"

            date = msg.get('Date')
            if date is None:
                date = "No Date"

            emails.append({
                'sender': from_header,
                'subject': subject,
                'body': body.decode(errors='ignore') if isinstance(body, bytes) else body,
                'date': date
            })

        mail.logout()
        return emails

    except Exception as e:
        print(f"Error fetching emails: {str(e)}")  # Print error for debugging
        return str(e)


@app.route('/fetch-emails', methods=['POST'])
def fetch_emails():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        imap_server = data.get('imapServer')
        num_emails = data.get('numEmails', 10)

        emails = check_inbox(email, password, imap_server, num_emails)
        if isinstance(emails, str):  # An error occurred during email fetching
            return jsonify({'error': emails}), 500

        return jsonify({'emails': emails})
    
    except Exception as e:
        print(f"Server Error: {str(e)}")  # Print detailed server-side error
        return jsonify({'error': 'An internal error occurred: ' + str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
