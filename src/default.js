var storage = require('./storage.js');
var gpio = require('pi-gpio');
var lightSensorPin = 22;

function setUp() {
  gpio.open(lightSensorPin, "input", function(err) {
    if (err) {
      console.log("Error opening pin #" + lightSensorPin + " for input. Err: " +
        err);
    } else {
      console.log("Pin #" + lightSensorPin + " opened successfully");
    }
  });
}

setUp();

setInterval(function () {
  gpio.read(lightSensorPin, function(err, value) {
    if (err) {
      console.log('An error ocurred: ' + err);
      return;
    }

    console.log('lightValue is: ' +  value);
  });

  var reading = new storage.sensorReading();
  reading.temperature = 77.33;
  reading.location.longitude = 122.11;
  reading.location.latitude = 22;

  storage.logData(reading);
}, 1000);
