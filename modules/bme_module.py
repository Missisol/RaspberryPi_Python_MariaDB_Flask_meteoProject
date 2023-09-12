import smbus2
import bme280
import time
import math
from pytz import timezone
import pytz


class BME280Module:
    SEA_LEVEL_PRESSURE_HPA = 1013.25
    PORT = 1
    ADDRESS = 0x76

    
    def __init__(self):
        self.bus = smbus2.SMBus(BME280Module.PORT)
        self.calibration_params = bme280.load_calibration_params(self.bus, BME280Module.ADDRESS)
        
        
    def get_sensor_readings(self):
        sample_reading = bme280.sample(self.bus, BME280Module.ADDRESS, self.calibration_params)
        temperature_val = sample_reading.temperature
        humidity_val = sample_reading.humidity
        pressure_raw_val = sample_reading.pressure
        timestamp_raw_val = sample_reading.timestamp

        # Altitude calculation
        # altitude_val = 44330 * (1.0 - math.pow(pressure_val / BME280Module.SEA_LEVEL_PRESSURE_HPA, 0.1903))

        # Date calculation 
        utc = pytz.utc
        moscowtz = timezone('Europe/Moscow')
        timestamp_val = timestamp_raw_val.astimezone(moscowtz)
        fmt = '%d-%m-%Y %H:%M:%S'
        current_date = timestamp_val.astimezone(moscowtz).strftime(fmt)

        # Pressure convertion to mmHg
        pressure_val = pressure_raw_val * 0.75

        return (temperature_val, pressure_val, humidity_val, timestamp_val)




    