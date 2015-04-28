var storage = require('./storage.js');
var ADC = require('adc-pi-gpio');

var lightSensorChannel = 0,
  tempSensorChannel = 1;
var analogSensors;

function initADC() {
  var adcConfig = {
    tolerance : 2,
		interval : 300,
		channels : [
      lightSensorChannel,
      tempSensorChannel
    ],
		SPICLK: 12,
		SPIMISO: 16,
		SPIMOSI: 18,
		SPICS: 22
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
}

function tearDown() {
  analogSensors.close();
}

var sensors = {
  init: initADC,
  readLightSensor: function () {
    analogSensors.read(lightSensorChannel, function(value) {
      console.log('lightValue is: ' +  value);

      return value;
    });
  },
  tearDown: tearDown
};

// Exports
module.exports = sensors;
