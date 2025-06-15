#include <OneWire.h>
#include <DallasTemperature.h>
#define ONE_WIRE_BUS 2

int turbidity=A0;
const int TDS=A1;
const int pH=A2;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);
 
  while(!Serial){}
  pinMode(turbidity, INPUT);
  pinMode(TDS, INPUT);
  pinMode(pH, INPUT);
  sensors.begin();
  delay(1000);
}

void loop() {
  
  float value_turbidity=analogRead(turbidity);
  float value_TDS=analogRead(TDS);
  float value_pH=analogRead(pH);

  float voltage_NTU=value_turbidity*5.0/1024.0;
  float voltage_TDS=value_TDS*5.0/1024.0;
  float voltage_pH=value_pH*5.0/1024.0;

  //Calculate turbidity in NTU
  float NTU=(-666.67*voltage_NTU)+3000;

  //Calculate pH value
  float pHvalue=7+((2.5-voltage_pH)/0.166);

  //Calculate temperature
  sensors.requestTemperatures();   // Request temperature
  float temperature = sensors.getTempCByIndex(0); // Read temperature in degrees Celsius

  //Calculate TDS in ppm
  float compensation_coefficient=1.0+0.02*(temperature-25.0);
  float compensation_voltage=voltage_TDS/compensation_coefficient;
  float TDS_ppm=(133.42*pow(compensation_voltage,3)-255.86*pow(compensation_voltage,2) +857.39*compensation_voltage)*0.5;
  
  Serial.print("Turbidity1:");
  Serial.println(NTU);
  
  Serial.print("TDS:");
  Serial.println(TDS_ppm);

  Serial.print("pH:");
  Serial.println(pHvalue);

  // Check whether the sensor responds or not
  if (temperature == DEVICE_DISCONNECTED_C) {
    Serial.println("Error: sensor disconnected!");
  } else {
    Serial.print("Temperature:");
    Serial.println(temperature);
  }
    delay(1000);
}
