# Author: Yashesh Savani
# Cloud Team 12
# Date Created: 29th-March-2020

from flask import Flask, jsonify
from flask import request
import pymysql
import pymysql.cursors as cursors
import time
import logging
import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/ticketcreation', methods=['POST'])
def ticket_creation():

    email = str(request.json['email'])
    destination_name = str(request.json['destination_name']).capitalize()
    city = str(request.json['city']).capitalize()
    province = str(request.json['province']).upper()
    date_booked = str(datetime.datetime.now())
    date_travel = str(request.json['date_travel'])
    ticket_price = str(request.json['ticket_price'])
    passenger_number = str(request.json['passenger_number'])
    source = str(request.json['source']).capitalize()
    busid = str(request.json['busid'])
    total = int(passenger_number) * int(ticket_price)
    print(email, destination_name, city, province, date_booked,
          date_travel, ticket_price, passenger_number)

    while True:
        # Connect to database
        conn = pymysql.connect(host='tourismdb.cefqm5hgun7y.us-east-1.rds.amazonaws.com', port=3306,
                                    user='admin', password='toor12345', db='tourist', charset="utf8mb4",
                                    cursorclass=cursors.DictCursor)
        if conn:
            try:
                cursor = conn.cursor()
                # data access

                # Insert User data into table on registration
                insert_query = 'INSERT INTO Ticketdetail (Email,Destination_name,\
                    City,Province,Date_booked,Date_travel,Ticket_price,Passenger_number,Total, Source, Busid) \
                                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'

                cursor.execute(insert_query, (email, destination_name,
                                              city, province, date_booked, date_travel, str(ticket_price), str(passenger_number), str(total), source, busid))
                conn.commit()
            finally:
                conn.close()
            break
        else:
            logging.log(
                msg='Unable to connect to Ticket detail\n Trying to reconnect...', level=logging.DEBUG)
    return jsonify({'Result': 'Data Inserted'})


@app.route('/gettickets', methods=['GET'])
def get_tickets():

    email = str(request.args.get('email'))

    while True:
        # Connect to database
        conn = pymysql.connect(host='tourismdb.cefqm5hgun7y.us-east-1.rds.amazonaws.com', port=3306,
                                    user='admin', password='toor12345', db='tourist', charset="utf8mb4",
                                    cursorclass=cursors.DictCursor)
        if conn:

            try:
                cursor = conn.cursor()
                select_all_data = 'SELECT * from Ticketdetail WHERE Email = %s'

                cursor.execute(select_all_data, (str(email)))
                conn.commit()
                result = cursor.fetchall()
            finally:
                conn.close()
            break
        else:
            logging.log(
                msg='Unable to connect to Ticket detail\n Trying to reconnect...', level=logging.DEBUG)
    return jsonify({'Result': result})


if __name__ == "__main__":

    app.run(host="0.0.0.0", port=5001, debug=True)
