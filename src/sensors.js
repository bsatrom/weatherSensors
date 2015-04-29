var settings = require('./settings.js');

var com = require("serialport");
var serialPort;

function initSerial(port) {
  serialPort = new com.SerialPort(settings.serialPort, {
    baudrate: settings.baudRate,
    parser: com.parsers.readline('\r\n')
  });

  serialPort.on('open', function() {
    sensors.connected = true;

    console.log('LOG: Serial port open');

    //Pause after opening serial to ensure we get good data
    setTimeout(function() {
      serialPort.on('data', function(data) {

        data = data.toString();
        sensors.dataReceived = true;

        console.log('data received: ' + data);

        // Serial doesn't always send a complete string,
        // so check for begin and end marks
        if (data.indexOf('{') >= 0 && data.indexOf('}') > 0) {
          data = data.substring(0, data.indexOf('}') + 1);

          var sensorData = JSON.parse(data);
          sensors.humidityValue = sensorData.humidity;
          sensors.lightValue = sensorData.light_lvl;
          sensors.tempValue = sensorData.tempf;
          sensors.pressureValue = sensorData.pressure;
        }
      });
    }, 3000);

    serialPort.on('close', function(err) {
      console.log('LOG: Closing Serial Port');
    });

    serialPort.on('error', function(err) {
      console.log('ERROR: ' + err);
    });

    process.on('SIGTERM', function() {
      console.log('LOG: closing serial ports...');

      serialPort.close();
    });
  });
}

function tearDown() {
  if (sensors.connected) {
    serialPort.close();
  }
}

var sensors = {
  init: initSerial,
  connected: false,
  dataReceived: false,
  lightValue: 0,
  tempValue: 0,
  pressureValue: 0,
  humidityValue: 0,
  tearDown: tearDown
};

// Exports
module.exports = sensors;
