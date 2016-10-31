var awsIot = require('aws-iot-device-sdk');
var thingShadow = awsIot.thingShadow;
const operationTimeout = 10000;
const thingName = 'aBebop';
var currentTimeout = null;
var stack = [];
const thingShadows = thingShadow({
    host: "ams6ieb4v4dry.iot.us-east-1.amazonaws.com",
    port: 8883,
    region: 'us-east-1',
    clientId: 'droneGateway',
    caCert: '../aws-certsroot-CA.crt',
    clientCert: '../aws-certs2e0058135a-certificate.pem.crt',
    privateKey: '../aws-certs2e0058135a-private.pem.key'
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

function registerShadow (thingName, state) {
    // update method returns clientToken
    thingShadows.register(thingName, {
        ignoreDeltas: true,
        operationTimeout: operationTimeout
    }, function(err, failedTopics) {
        if (err) {
            console.log('connection error:', err);
        }
        if (failedTopics) {
            console.log('connection failed topics:', failedTopics);
        }
        if (typeof err === 'undefined' && typeof failedTopics === 'undefined') {
            console.log('device thing registered');
            var theState = generateState('connect');
            executeOperation('update', theState);
            executeOperation('publish', theState);
        }
    });
}

function executeOperation(oName, stateObject) {
    var clientToken = thingShadows[oName](thingName, stateObject);
    // if token is non-null it gets sent in a status event upon operation completion
    // if token null another operation is in progress
    if (clientToken === null) {
        console.log('update shadow failed, operation in progress');
        if (currentTimeout !== null) {
            currentTimeout = setTimeout(function() {
                executeOperation(oName, stateObject);
            }, operationTimeout * 2);
        }
    } else {
        console.log('update shadow succeeded');
        stack.push(clientToken);
    }
}

function handleConnect () {
    // after connecting to aws iot register interest in thing shadow
    console.log('connected to aws');
    thingShadows.subscribe('test');
    registerShadow();
}

function handleStatus (thingName, stat, clientToken, stateObject) {
    // reports status completion of update(), get(), and delete() calls
    var expectedClientToken = stack.pop();

    if (expectedClientToken === clientToken) {
        console.log('stat', stat, 'status on', thingName);
    } else {
        console.log('client token mismatch on', thingName);
    }
}

function handleDelta (thingName, stateObject) {
    console.log('delta on', thingName, ':', JSON.stringify(stateObject));
}

function handleTimeout (thingName, clientToken) {
    var expectedClientToken = stack.pop();

    if (expectedClientToken === clientToken) {
        console.log('received timeout on', thingName, ':', JSON.stringify(clientToken));
    } else {
        console.log('timeout client mismatch on', thingName);
    }
}

function handleClose (thingName) {
    console.log('close');
    thingShadows.unregister(thingName);
}

function handleOffline () {
    console.log('offline');
    // if any timeout is pending cancel it
    if (currentTimeout !== null) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    // cancel any operation currently underway
    while (stack.length) {
        stack.pop();
    }
}

function handleMessage (topic, payload) {
    console.log('message', topic, payload.toString());
}

// shadow handling
thingShadows
    .on('connect', function() {
        handleConnect();
    })
    .on('status', function(thingName, stat, clientToken, stateObject) {
        handleStatus(thingName, stat, clientToken, stateObject);
    })
    .on('delta', function(thingName, stateObject) {
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
        handleOffline();
    })
    .on('error', function() {
        console.log('error');
    })
    .on('message', function(topic, payload) {
        handleMessage(topic, payload);
    });