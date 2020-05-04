from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
import pymysql.cursors as cursors
import pymysql
import time
import logging
import datetime
import hashlib
import pyotp
import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    email = str(request.args.get("email"))
    password = str(request.args.get("password"))

    password = hashlib.md5(password.encode()).hexdigest()  # encrypted password
    while True:
        conn = pymysql.connect(host='tourismdb.cefqm5hgun7y.us-east-1.rds.amazonaws.com', port=3306,
                               user='admin', password='toor12345', db='tourist', charset="utf8mb4",
                               cursorclass=cursors.DictCursor)

        if conn:

            cursor = conn.cursor()

            search_query = 'SELECT * FROM Userdata WHERE Email = "{}"'.format(email);

            cursor.execute(search_query)
            row = cursor.fetchone()
            email_searched = row
            if (email_searched != None):

                if email_searched['Password'] == password:
                    context = ssl.create_default_context()

                    message = MIMEMultipart()
                    base32secret = pyotp.random_base32()
                    totp = pyotp.TOTP(base32secret)
                    otp = totp.now()
                    print('OTP:', otp)

                    message['From'] = "travelapp.canada@gmail.com"
                    message['To'] = email_searched['Email']
                    message['Subject'] = "Tourismo OTP Code:"
                    body ="Your OTP is: " + otp
                    message.attach(MIMEText(body, 'plain'))
                    text = message.as_string()

                    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
                        server.login("travelapp.canada@gmail.com", "group1220")
                        server.sendmail("travelapp.canada@gmail.com", email_searched['Email'], text)


                    details = {}
                    details['otp'] = otp;
                    details['Name'] = email_searched['Name']
                    details['Email'] = email_searched['Email']
                    return details
                else:
                    return "INCORRECT PASSWORD"
            else:
                return "EMAIL NOT FOUND"
        else:
            return "CONECTION ERROR"


@app.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    email = str(request.args.get("email"))
    name = str(request.args.get("name"))
    date_created = str(datetime.datetime.now())
    password = str(request.args.get("password"))

    password = hashlib.md5(password.encode()).hexdigest()  # encrypted password

    while True:

        # Connect to database
        conn = pymysql.connect(host='tourismdb.cefqm5hgun7y.us-east-1.rds.amazonaws.com', port=3306,
                               user='admin', password='toor12345', db='tourist', charset="utf8mb4",
                               cursorclass=cursors.DictCursor)
        if conn:
            try:
                cursor = conn.cursor()
                # Insert User data into table on registration
                insert_query = 'INSERT INTO Userdata (Email,Name,Date_created,Password) VALUES (%s,%s,%s,%s) '

                cursor.execute(insert_query, (email, name, date_created, password))

                conn.commit()

            finally:
                conn.close()
            break
        else:
            logging.log(
                msg='User registration failed\n Trying to reconnect...', level=logging.DEBUG)

    return "SIGN-UP SUCCESSFUL"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
