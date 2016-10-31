var awsIot = require('aws-iot-device-sdk');
var thingShadow = awsIot.thingShadow;
const operationTimeout = 10000;
const thingName = 'aBebop';
const thingShadows = thingShadow({
    host: "ams6ieb4v4dry.iot.us-east-1.amazonaws.com",
    port: 8883,
    region: 'us-east-1',
    clientId: 'laptop',
    caCert: '../aws-certs/root-CA.crt',
    clientCert: '../aws-certs/2e0058135a-certificate.pem.crt',
    privateKey: '../aws-certs/2e0058135a-private.pem.key'
});

function generateState (cState) {
    var droneState = {
        state: {
            desired:{
                    connect: false,
                    takeoff: false,
                    land: false
                }
            }
        };
    
    switch (cState) {
        case 'connect':
            droneState.state.desired.connect = true;
            break;
        case 'takeoff':
            droneState.state.desired.takeoff = true;
            break;
        case 'land':
            droneState.state.desired.land = true;
            break;
    }
    return droneState;
}

function registerShadow () {
    thingShadows.register(thingName, {
        ignoreDeltas: false,
        operationTimeout: operationTimeout
    }, function (err, failedTopics) {
        if (err) {
            console.log('connection error:', err);
        }
        if (failedTopics) {
            console.log('connection failed topics:', failedTopics);
        }
        if (typeof err === 'undefined' && typeof failedTopics === 'undefined') {
            console.log('mobile thing registered');
        }
    });
}

function handleConnect() {
    // after connecting to aws iot register interest in thing shadow
    console.log('connected to aws');
    thingShadows.subscribe('test');
    registerShadow();
}

function handleStatus (thingName, stat, clientToken, stateObject) {
    // reports status completion of update(), get(), and delete() calls
    console.log('got stat', stat, 'for', thingName);
}

function handleDelta(thingName, stateObject) {
    console.log('delta on', thingName, ':', JSON.stringify(stateObject));
}

function handleTimeout(thingName, clientToken) {
    console.log('received timeout on', thingName, ':', JSON.stringify(clientToken));
}

function handleClose(thingName) {
    console.log('close');
    thingShadows.unregister(thingName);
}

function handleMessage(topic, payload) {
    console.log('message', topic, payload.toString());
    var theMsg = JSON.parse(payload.toString());
    if (topic === 'test') {
        console.log('test message received!');    
    }
}

/*
* thingshadow event handling
*/
thingShadows
    .on('connect', function () {
        handleConnect();
    })
    .on('status', function (thingName, stat, clientToken, stateObject) {
        handleStatus(thingName, stat, clientToken, stateObject);
    })
    .on('delta', function (thingName, stateObject) {
        handleDelta(thingName, stateObject);
    })
    .on('timeout', function(thingName, clientToken) {
        handleTimeout(thingName, clientToken);
    })
    .on('close', function() {
        handleClose(thingName);
    })
    .on('reconnect', function() {
        console.log('reconnect');
    })
    .on('offline', function() {
        console.log('offline');
    })
    .on('error', function() {
        console.log('error');
    })
    .on('message', function(topic, payload) {
        handleMessage(topic, payload);
    });