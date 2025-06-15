import serial
import time
import requests
import pyrebase
from datetime import datetime

firebase_config = {
    "apiKey": "AIzaSyCEz7ce7k7EF_R9TJzi_TdzzJ6IIsQRisg",
    "authDomain": "disertatie-b577e",
    "databaseURL": "https://disertatie-b577e-default-rtdb.firebaseio.com",
    "storageBucket": ""
}

firebase=pyrebase.initialize_app(firebase_config)
db= firebase.database()

ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1.0)
time.sleep(3)

print("Serial OK")

try:
    while True:
        time.sleep(0.01)
        if ser.in_waiting >0:
            Turbidity_value =ser.readline().decode('utf-8').rstrip()
            TDS_value =ser.readline().decode('utf-8').rstrip()
            pH_value =ser.readline().decode('utf-8').rstrip()
            Temperature_value =ser.readline().decode('utf-8').rstrip()
            print(Turbidity_value)
            print(TDS_value)
            print(pH_value)
            print(Temperature_value)

            Turbidity_value=float(Turbidity_value.split(":")[1].strip())
            TDS_value=float(TDS_value.split(":")[1].strip())
            pH_value=float(pH_value.split(":")[1].strip())
            Temperature_value=float(Temperature_value.split(":")[1].strip())
            
                              
            current_time=datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            
            sensor_data={
                "Turbidity": Turbidity_value,
                "TDS": TDS_value,
                "pH": pH_value,
                "Temperature": Temperature_value
            }
             
            db.child(current_time).set(sensor_data)
            
            print("Data sent to Firebase!")
        
except Exception as e:
            print("Error: ", e)
            
time.sleep(2)
        
            

    
    

