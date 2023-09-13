import os
from dotenv import load_dotenv
import mysql.connector as database

load_dotenv()

MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_DB = os.getenv('MYSQL_DB')

connection = database.connect(
    user=MYSQL_USER,
    password=MYSQL_PASSWORD,
    host='localhost',
    database=MYSQL_DB)

cursor = connection.cursor()

def create_table_bmehistorytemerature():
    try:
        statement = "CREATE OR REPLACE TABLE bme_history (id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, date DATE, min_temperature DECIMAL(4,2), max_temperature DECIMAL(4,2), min_humidity DECIMAL(4,2), max_humidity DECIMAL(4,2), min_pressure DECIMAL, max_pressure DECIMAL)"
        cursor.execute(statement)
        connection.commit()
        print("Successfully created table bme_history")
    except database.Error as e:
        print(f"Error adding entry to database: {e}")

create_table_bmehistorytemerature()

connection.close()
