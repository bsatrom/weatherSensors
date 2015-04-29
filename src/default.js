var storage = require('./storage.js');
var sensors = require('./sensors.js');

function init() {
  storage.init();
  sensors.init();
}

init();

//Pause after opening serial to ensure we get good data
setTimeout(function() {

  if(sensors.connected && sensors.dataReceived) {

    setInterval(function () {
      var reading = new storage.sensorReading();

      reading.light = sensors.lightValue;
      reading.temperature = sensors.tempValue;
      reading.pressure = sensors.pressureValue;
      reading.humidity = sensors.humidityValue;

      console.log("LOG: " + JSON.stringify(reading));

      storage.logData(reading);
    }, 5000);

  } else {
    console.log("Serial port not connected or data not received." +
      " Shutting down.");
    sensors.tearDown();
    process.exit();
  }

}, 5000);
