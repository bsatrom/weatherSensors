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

  reading.light = sensors.lightValue;
  reading.temperature = sensors.tempValue;

  // TODO: Fix These
  reading.location.longitude = 122.11;
  reading.location.latitude = 22;

  console.log("LIGHT1: " + sensors.lightValue);
  console.log("TEMP1: " + sensors.tempValue);

  console.log(JSON.stringify(reading));

  storage.logData(reading);
}, 5000);

process.on('SIGTERM', cleanUp);
process.on('SIGINT', cleanUp);
