var storage = require('./storage.js');
var gpio = require('rpi-gpio');
var lightSensorPin = 17;

function setUp() {
  gpio.setup(lightSensorPin, gpio.DIR_IN);
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
