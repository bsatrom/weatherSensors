var storage = require('./storage.js');

setInterval(function () {
  var reading = new storage.sensorReading();
  reading.temperature = 77.33;
  reading.location.longitude = 122.11;
  reading.location.latitude = 22;

  storage.logData(reading);
}, 1000);
