var storage = require('./storage.js');
var ADC = require('adc-pi-gpio');

var lightSensorChannel = 0,
  tempSensorChannel = 1;
var analogSensors;
var lightVal, tempVal;

var channelResponders = [
  function(value, pct) { // Light Sensor
    console.log('lightValue is: ' +  value + '. pct: ' + pct);
    lightVal = value;
  },
  function(value, pct) { // Temp Sensor
    console.log('tempValue is: ' +  value + '. pct: ' + pct);
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
      console.log('Analog Pins ready, listening to channel...');
  });

  analogSensors.on('close', function() {
  	console.log('ADC terminated');
  	process.exit();
  });

  // Respond to sensor changes
  analogSensors.on('change', function(data) {
    if (data) {
      var channel = data.channel,
        value = data.value,
        pct = data.pct;

      channelResponders[channel](value, pct);
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
