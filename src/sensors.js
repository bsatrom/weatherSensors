var storage = require('./storage.js');
var ADC = require('adc-po-gpio');

var lightSensorChannel = 0,
  tempSensorChannel = 1;
var analogSensors;


function initADC() {
  var adcConfig = {
    tolerance : 2,
		interval : 300,
		channels : [
      lightSensorChannel,
      temperatureSensorChannel
    ],
		SPICLK: 12,
		SPIMISO: 16,
		SPIMOSI: 18,
		SPICS: 22
  };

  var adc = new ADC(adcConfig);
  adc.init();

  return adc;
}

function tearDown() {
  analogSensors.close();
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

var sensors = {
  init: initADC,
  readLightSensor: function () {
    analogSensors.read(lightSensorChannel, function(value) {
      console.log('lightValue is: ' +  value);

      return value;
    });
  },
  tearDown: tearDown()
};

// ADC Events
analogSensors.on('ready', function() {
    console.log('Analog Pins ready, listening to channel...');
});

adc.on('close', function() {
	console.log('ADC terminated');
	process.exit();
});

// Exports
module.exports = sensors;
