#include <Wire.h> //I2C needed for sensors
#include "MPL3115A2.h" //Pressure sensor
#include "HTU21D.h" //Humidity sensor

MPL3115A2 myPressure; //Create an instance of the pressure sensor
HTU21D myHumidity; //Create an instance of the humidity sensor

//Hardware pin definitions for weather shield
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// digital I/O pins
#define STAT2 8

// analog I/O pins
#define REFERENCE_3V3 A3
#define LIGHT A1
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

#define debug false
unsigned long lastConnectionTime;

float humidity = 0; // [%]
float tempf = 0; // [temperature F]
float pressure = 0;

float light_lvl = 455; //[analog value from 0 to 1023]

void setup()
{
  int i;
  
  Serial.begin(9600);
  
  pinMode(STAT2, OUTPUT); //Status LED Green
  
  pinMode(REFERENCE_3V3, INPUT);
  pinMode(LIGHT, INPUT);

  //Configure the pressure sensor
  myPressure.begin(); // Get sensor online
  myPressure.setModeBarometer(); // Measure pressure in Pascals from 20 to 110 kPa
  myPressure.setOversampleRate(7); // Set Oversample to the recommended 128
  myPressure.enableEventFlags(); // Enable all three pressure and temp event flags 

  //Configure the humidity sensor
  myHumidity.begin();

  lastConnectionTime = millis();

  if (debug) {
    Serial.println();
    Serial.println("Weather Shield online!");
  }
}

void loop()
{  
  if(millis() - lastConnectionTime > 1000)
  {
    digitalWrite(STAT2, HIGH); //Blink stat LED
    
    calcWeather();
    printWeather();
    
    digitalWrite(STAT2, LOW); //Turn off stat LED
  }
}

void printWeather()
{
  Serial.print("{\"humidity\":");
  Serial.print(humidity, 1);
  Serial.print(", \"tempf\":");
  Serial.print(tempf, 1);
  Serial.print(", \"pressure\":");
  Serial.print(pressure, 2);
  Serial.print(", \"light_lvl\":");
  Serial.print(light_lvl, 2);
  Serial.print("}");
  Serial.println();
}

void calcWeather()
{
  humidity = myHumidity.readHumidity();
  tempf = myPressure.readTempF();
  pressure = myPressure.readPressure();
  light_lvl = get_light_level();
}

float get_light_level()
{
  float operatingVoltage = analogRead(REFERENCE_3V3);
  float lightSensor = analogRead(LIGHT);
  operatingVoltage = 3.3 / operatingVoltage; //The reference voltage is 3.3V 
  lightSensor = operatingVoltage * lightSensor; 
  return(lightSensor);
}
