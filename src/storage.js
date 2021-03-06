var baasSDK = require('everlive-sdk');
var tbaas, sensorRepository;

function init() {
  tbaas = new baasSDK('GN5HrV1nzDwl8GsK');
  sensorRepository = tbaas.data('sensors');
}

var storage = {
  init: init,
  sensorReading: function() {
    this.temperature = 0;
    this.light = 0;
    this.humidity = 0;
    this.pressure = 0;
    this.soundLevel = 0;
    this.location = {
      'longitude': 0,
      'latitude': 0
    };
  },
  logData: function(reading) {
    sensorRepository.create(reading,
      function(data) {
        console.log("LOG: Successfully posted sensor data to cloud. " +
          JSON.stringify(data));
      },
      function(error) {
        console.log("ERR: Error posting sensor data to cloud: " +
          JSON.stringify(error));
      });
  }
};

module.exports = storage;
