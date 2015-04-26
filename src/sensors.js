var storage = require('./storage.js');
var gpio = require('pi-gpio');
var lightSensorPin = 22;

function init() {
  initPin(lightSensorPin, "input pulldown");
}

function initPin(pinNumber, direction) {
  gpio.open(pinNumber, direction, function(err) {
    if (err) {
      console.log("Error opening pin #" + lightSensorPin + " for " + direction +
        ". Err: " + err);
    } else {
      console.log("Pin #" + lightSensorPin + " opened successfully");
    }
  });
}

function tearDown() {
  // Add Pin tear-down logic
}

var sensors = {
  init: init,
  readLightSensor: function () {
    gpio.read(lightSensorPin, function(err, value) {
      if (err) {
        console.log('An error ocurred: ' + err);
        return;
      }

      console.log('lightValue is: ' +  value);

      return value;
    });
  },
  tearDown: tearDown()
};

module.exports = sensors;
