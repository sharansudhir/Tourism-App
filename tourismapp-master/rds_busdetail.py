# Author: Yashesh Savani
# Cloud Team 12
# Date Created: 3rd-April-2020

from flask import Flask, jsonify
from flask import request
import pymysql
import pymysql.cursors as cursors
import time
import logging
import datetime

app = Flask(__name__)


@app.route('/busdetails')
def busdetails():

    source_city = str(request.args.get('source_city')).capitalize()
    destination_city = str(request.args.get('destination_city')).capitalize()

    while True:
        # Connect to database
        conn = pymysql.connect(host='tourismdb.cefqm5hgun7y.us-east-1.rds.amazonaws.com', port=3306,
                                    user='admin', password='toor12345', db='tourist', charset="utf8mb4",
                                    cursorclass=cursors.DictCursor)
        if conn:

            try:
                cursor = conn.cursor()
                # data access
                select_query = 'SELECT * FROM busdetails WHERE Source_city = %s AND Destination_city = %s'
                cursor.execute(select_query, (source_city, destination_city))
                bus_details = cursor.fetchall()

                conn.commit()

            finally:
                conn.close()
            break
        else:
            logging.log(
                msg='Unable to connect to Bus detail\n Trying to reconnect...', level=logging.DEBUG)
    return jsonify({'Result': bus_details})


@app.route('/updatebusdetails')
def update_busdetails():

    passenger_number = str(request.args.get('passenger_number'))
    bus_id = str(request.args.get('busid'))

    while True:
        # Connect to database
        conn = pymysql.connect(host='tourismdb.cefqm5hgun7y.us-east-1.rds.amazonaws.com', port=3306,
                                    user='admin', password='toor12345', db='tourist', charset="utf8mb4",
                                    cursorclass=cursors.DictCursor)
        if conn:

            try:
                cursor = conn.cursor()
                # data access
                select_query = 'SELECT Seats_filled, Seats_available, Status FROM busdetails WHERE Busid = %s'
                cursor.execute(select_query, (bus_id))
                busdata = cursor.fetchone()
                seats_filled = int(
                    busdata['Seats_filled']) + int(passenger_number)
                seats_available = int(
                    busdata['Seats_available']) - int(passenger_number)
                bus_status = busdata['Status']
                if seats_filled == 50:
                    bus_status = 'FULL'

                # Insert User data into table on registration
                update_data = 'UPDATE busdetails SET Seats_filled = %s, Seats_available = %s, Status = %s WHERE Busid = %s'

                cursor.execute(update_data, (str(seats_filled), str(
                    seats_available), str(bus_status), str(bus_id)))
                conn.commit()

            finally:
                conn.close()
            break
        else:
            logging.log(
                msg='Unable to connect to Bus detail\n Trying to reconnect...', level=logging.DEBUG)
    return jsonify({'Result': 'Tickets are booked'})


@app.route('/canceltickets')
def cancel_tickets():

    passenger_number = str(request.args.get('passenger_number'))
    bus_id = str(request.args.get('busid'))

    while True:
        # Connect to database
        conn = pymysql.connect(host='tourismdb.cefqm5hgun7y.us-east-1.rds.amazonaws.com', port=3306,
                                    user='admin', password='toor12345', db='tourist', charset="utf8mb4",
                                    cursorclass=cursors.DictCursor)
        if conn:

            try:
                cursor = conn.cursor()
                # data access
                select_query = 'SELECT Seats_filled, Seats_available, Status FROM busdetails WHERE Busid = %s'
                cursor.execute(select_query, (bus_id))
                busdata = cursor.fetchone()
                seats_filled = int(
                    busdata['Seats_filled']) - int(passenger_number)
                seats_available = int(
                    busdata['Seats_available']) + int(passenger_number)
                bus_status = busdata['Status']
                if seats_filled < 50:
                    bus_status = 'NOT FULL'

                # Insert User data into table on registration
                update_data = 'UPDATE busdetails SET Seats_filled = %s, Seats_available = %s, Status = %s WHERE Busid = %s'

                cursor.execute(update_data, (str(seats_filled), str(
                    seats_available), str(bus_status), str(bus_id)))
                conn.commit()

            finally:
                conn.close()
            break
        else:
            logging.log(
                msg='Unable to connect to Bus detail\n Trying to reconnect...', level=logging.DEBUG)
    return jsonify({'Result': 'Tickets are cancelled'})


if __name__ == "__main__":

    app.run(host="0.0.0.0", port=5002, debug=True)
