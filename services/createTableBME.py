import os
import mysql.connector as database

username = os.environ.get("username")
password = os.environ.get("password")

connection = database.connect(
    user='marina',
    password='ma1ri2na3',
    host='localhost',
    database="meteo")

cursor = connection.cursor()

def create_table_bmedata():
    try:
        statement = "CREATE OR REPLACE TABLE bme_data (id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, timestamp DATETIME, date DATE, temperature DECIMAL(4,2), humidity DECIMAL(4,2), pressure DECIMAL)"
        cursor.execute(statement)
        connection.commit()
        print("Successfully created table bme_data")
    except database.Error as e:
        print(f"Error adding entry to database: {e}")

create_table_bmedata()

connection.close()
