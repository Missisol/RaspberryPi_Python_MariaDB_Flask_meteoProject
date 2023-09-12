# import os
import mysql.connector as database

# username = os.environ.get("username")
# password = os.environ.get("password")

connection = database.connect(
    user='marina',
    password='ma1ri2na3',
    host='localhost',
    database="meteo")

cursor = connection.cursor()

def create_table_bmehistorytemerature():
    try:
        statement = "CREATE OR REPLACE TABLE bme_temerature_history (id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, date DATE, min_temperature DECIMAL(4,2), max_temperature DECIMAL(4,2))"
        cursor.execute(statement)
        connection.commit()
        print("Successfully created table bme_temerature_history")
    except database.Error as e:
        print(f"Error adding entry to database: {e}")

create_table_bmehistorytemerature()

connection.close()
