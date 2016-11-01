var AWS = require('aws-sdk');

var iotdata = new AWS.IotData({endpoint:'https://ams6ieb4v4dry.iot.us-east-1.amazonaws.com/things/droneControl/shadow'});
var params = {
    thingName: 'droneGateway'
};
iotdata.getThingShadow(params, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

