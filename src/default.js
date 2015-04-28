var storage = require('./storage.js');
var sensors = require('./sensors.js');

function init() {
  storage.init();
  sensors.init();
}

function cleanUp() {
  sensors.tearDown();
}

init();

setInterval(function () {
  var reading = new storage.sensorReading();

  reading.light = sensors.readLightSensor();

  reading.temperature = sensors.readTempSensor();
  reading.location.longitude = 122.11;
  reading.location.latitude = 22;

  storage.logData(reading);
}, 1000);

process.on('SIGTERM', cleanUp);
process.on('SIGINT', cleanUp);
