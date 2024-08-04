import imaplib
import email
from email.header import decode_header

def check_inbox(username, password, imap_server, num_emails=10):
    try:
        # Connect to the server
        mail = imaplib.IMAP4_SSL(imap_server)
        mail.login(username, password)

        # Select the mailbox you want to check
        mail.select('inbox')

        # Fetch a larger batch of emails initially to ensure enough unique "From" headers
        fetch_count = num_emails * 2
        status, messages = mail.search(None, 'ALL')
        email_ids = messages[0].split()
        email_ids = email_ids[-fetch_count:]  # Get the most recent emails

        seen_from_headers = set()

        index = 1
        for email_id in reversed(email_ids):  # Process in reverse order to get most recent first
            if index > num_emails:
                break

            status, msg_data = mail.fetch(email_id, '(RFC822)')
            msg = email.message_from_bytes(msg_data[0][1])

            # Get and decode the "From" header
            from_header, encoding = decode_header(msg.get('From'))[0]
            if isinstance(from_header, bytes):
                from_header = from_header.decode(encoding if encoding else 'utf-8')

            idnex2 = 0
            if from_header in seen_from_headers:
                print(f'{from_header} Görüldü:  {idnex2}')
                idnex2 +=1 
                continue

            print(f'{index}. From: {from_header}')
            print('-------------------------------------------------------------')

            seen_from_headers.add(from_header)
            index += 1

        # Logout
        mail.logout()

    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    username = ''
    password = ''
    imap_server = 'imap-mail.outlook.com'  # Correct IMAP server for Hotmail/Outlook
    num_emails = 10
    check_inbox(username, password, imap_server, num_emails)
