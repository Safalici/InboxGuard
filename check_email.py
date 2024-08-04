import imaplib
import email
from email.header import decode_header

def check_inbox(username, password, imap_server):
    try:
        # Connect to the server
        mail = imaplib.IMAP4_SSL(imap_server)
        mail.login(username, password)

        # Select the mailbox you want to check
        mail.select('inbox')

        # Search for all emails in the inbox
        status, messages = mail.search(None, 'ALL')
        email_ids = messages[0].split()

        for email_id in email_ids:
            status, msg_data = mail.fetch(email_id, '(RFC822)')
            msg = email.message_from_bytes(msg_data[0][1])

            # Print all headers
            from_header, encoding = decode_header(msg.get('From'))[0]
            if isinstance(from_header, bytes):
                from_header = from_header.decode(encoding if encoding else 'utf-8')
            print(f'From: {from_header}')

            print('-------------------------------------------------------------')

        # Logout
        mail.logout()

    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    
    username = ''
    password = ''

    imap_server = 'imap-mail.outlook.com' 

    check_inbox(username, password, imap_server)


##Gmail: imap.gmail.com
##Outlook/Hotmail: imap-mail.outlook.com
##Yahoo Mail: imap.mail.yahoo.com
##iCloud Mail: imap.mail.me.com
##AOL Mail: imap.aol.com