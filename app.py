import os
from dotenv import load_dotenv
from flask import Flask, render_template, jsonify
from flask_mysqldb import MySQL
from datetime import date, datetime, timedelta
from modules.bme_module import BME280Module

app = Flask(__name__)

load_dotenv()

MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_DB = os.getenv('MYSQL_DB')


app.config['MYSQL_HOST'] = 'localhost'
app.config["MYSQL_USER"] = MYSQL_USER
app.config["MYSQL_PASSWORD"] = MYSQL_PASSWORD
app.config["MYSQL_DB"] = MYSQL_DB

mysql = MySQL(app)

bme280_module = BME280Module()


def check_date_is_in_history_table():
    yesterday =  date.today() - timedelta(days=1)
    cursor = mysql.connection.cursor()

    try:
        statement = "SELECT date FROM bme_temerature_history WHERE (date=%s)"
        cursor.execute(statement, [yesterday])
        dt = cursor.fetchall()
        if not dt:   
            insert_temperature_delta() 
    except mysql.connection.Error as e:
        print(f"Error select date from bme_temerature_history: {e}")
    cursor.close()


def check_yesterday_is_in_table():
    yesterday =  date.today() - timedelta(days=1)
    cursor = mysql.connection.cursor()

    try:
        statement = "SELECT date FROM bme_data WHERE (date=%s)"
        cursor.execute(statement, [yesterday])
        dt = cursor.fetchall()
        return bool(dt)
    except mysql.connection.Error as e:
        print(f"Error select date from bme_data: {e}")
    cursor.close()


def insert_temperature_delta():
    yesterday =  date.today() - timedelta(days=1)
    cursor = mysql.connection.cursor()

    if check_yesterday_is_in_table():
        try:
            statement = "INSERT INTO bme_temerature_history (date, min_temperature, max_temperature) SELECT (SELECT date FROM bme_data WHERE (date=%s) ORDER BY temperature ASC LIMIT 1) AS date, (SELECT  temperature FROM bme_data WHERE (date=%s) ORDER BY temperature ASC LIMIT 1) AS min_temperature, (SELECT temperature FROM bme_data WHERE (date=%s) ORDER BY temperature DESC LIMIT 1) AS max_temperature"
            cursor.execute(statement, [yesterday, yesterday, yesterday])
            mysql.connection.commit()
            print("Successfully insert temperature history to bme_temerature_history")
        except mysql.connection.Error as e:
            print(f"Error insert temperature history to bme_temerature_history: {e}")
        cursor.close()

def insert_data(timestamp, date, temperature, humidity, pressure):
    try:
        statement = "INSERT INTO bme_data (timestamp, date, temperature, humidity, pressure) VALUES (%s, %s, %s, %s, %s)"
        data = (timestamp, date, temperature, humidity, pressure)
        cursor = mysql.connection.cursor()
        cursor.execute(statement, data)
        mysql.connection.commit()
        print("Successfully insert entry to bme_data")
    except mysql.connection.Error as e:
        print(f"Error insert entry to bme_data: {e}")
    cursor.close()

@app.route("/lastDataReading")
def select_data():
    try:
        statement = "SELECT * FROM bme_data ORDER BY timestamp DESC LIMIT " + str(10)
        cursor = mysql.connection.cursor()
        cursor.execute(statement)
        data = cursor.fetchall()
        dates = []
        temperatures = []
        humidities = []
        pressures = []
        fmt = '%H:%M:%S'
        
        for row in reversed(data):
            dates.append(row[1].strftime(fmt))
            temperatures.append(round(row[3], 1))
            humidities.append(round(row[4], 1))
            pressures.append(round(row[5]))

        print("Successfully select entry from bme_data")
        return jsonify(
        { 
            "temperatures": temperatures,
            "pressures": pressures,
            "humidities": humidities,
            "dates": dates,
        })
    except mysql.connection.Error as e:
        print(f"Error select entry from bme_data: {e}")
    cursor.close()


@app.route("/tempDelta")
def get_temp_delta():
    try:
        statement = "SELECT * FROM bme_temerature_history ORDER BY date DESC LIMIT " + str(10)
        cursor = mysql.connection.cursor()
        cursor.execute(statement)
        data = cursor.fetchall()
        dates = []
        min_t = []
        max_t = []
        fmt = '%H:%M:%S'

        rowCount = len(data)

        if rowCount != 0:
            for row in reversed(data):
                dates.append(str(row[1]))
                min_t.append(round(row[2], 2))
                max_t.append(round(row[3], 2))
            print(dates)

            print("Successfully select temp_delta from bme_temerature_history")
            return jsonify(
            { 
                "dates": dates,
                "min_t": min_t,
                "max_t": max_t,
            })
    except mysql.connection.Error as e:
        print(f"Error select temp_delta from bme_temerature_history: {e}")
    cursor.close()


@app.route("/")
def init_template():
    return render_template("index.html")


@app.route("/sensorDataReading")
def get_sensor_readings():
    temperature, pressure, humidity, timestamp = bme280_module.get_sensor_readings()

    fm = '%Y-%m-%d'
    fmt = '%d-%m-%Y %H:%M:%S'

    insert_data(timestamp, timestamp.strftime(fm), temperature, humidity, pressure)
    check_date_is_in_history_table()

    return jsonify(
        {
            "status": "OK",
            "temperature": round(temperature, 1),
            "pressure": round(pressure),
            "humidity": round(humidity, 1),
            "date": timestamp.strftime(fmt),
        }
    )


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')