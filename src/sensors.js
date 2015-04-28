var storage = require('./storage.js');
var ADC = require('adc-pi-gpio');

var lightSensorChannel = 0,
  tempSensorChannel = 1;
var analogSensors;
var lightVal, tempVal;

var channelResponders = [
  function(value) { // Light Sensor
    console.log('DEBUG: lightValue is: ' +  value);
    lightVal = value;
  },
  function(value) { // Temp Sensor
    console.log('DEBUG: tempValue is: ' +  value);
    tempVal = value;
  }
];

function initADC() {
  var adcConfig = {
    tolerance : 2,
    interval : 300,
    channels : [
      lightSensorChannel,
      tempSensorChannel
    ],
    SPICLK: 23,
    SPIMISO: 21,
    SPIMOSI: 19,
    SPICS: 24
  };

  analogSensors = new ADC(adcConfig);
  analogSensors.init();

  // ADC Events
  analogSensors.on('ready', function() {
      console.log('LOG: Analog Pins ready, listening to channel...');
  });

  analogSensors.on('close', function() {
  	console.log('LOG: ADC terminated');
  	process.exit();
  });

  // Respond to sensor changes
  analogSensors.on('change', function(data) {
    if (data) {
      var channel = data.channel,
        value = data.value;

      channelResponders[channel](value);
    }
  });
}

function tearDown() {
  analogSensors.close();
}

var sensors = {
  init: initADC,
  lightValue: lightVal,
  tempValue: tempVal,
  tearDown: tearDown
};

// Exports
module.exports = sensors;
