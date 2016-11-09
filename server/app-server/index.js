var awsIot = require('aws-iot-device-sdk');
var thingShadow = awsIot.thingShadow;
const operationTimeout = 10000;
var currentTimeout = null;
const thingName = 'bebop';
var stack = [];
const thingShadows = thingShadow({
    host: "ams6ieb4v4dry.iot.us-east-1.amazonaws.com",
    port: 8883,
    region: 'us-east-1',
    clientId: 'droneApp',
    caCert: '../../aws-certs/root-CA.crt',
    clientCert: '../../aws-certs/afa4bee0c2-certificate.pem.crt',
    privateKey: '../../aws-certs/afa4bee0c2-private.pem.key'
});

var express = require('express');
var router = express.Router();
var testId = 1;

router.route('/:id')
    .post(function(req, res) {
        console.log('updating fly id request');
        var theRouteId = req.params.id;
        registerShadow(theRouteId);
    });

var currentState = {
    connect: false,
    takeoff: false,
    land: false,
    route: {
        isSet: false,
        routeId: null
    }
};

function generateState (cState, id) {
    var newRoute = null;
    if (id !== null) {
        newRoute = id;
    }
    
    var desired = {
        connect: false,
        takeoff: false,
        land: false,
        route: {
            isSet: false,
            routeId: newRoute
        }
    };
    
   switch (cState) {
        case 'connect':
            desired.connect = true;
            desired.takeoff = false;
            desired.land = false;
            desired.route.isSet = false;
            break;
        case 'takeoff':
            desired.connect = true;
            desired.takeoff = true;
            desired.land = false;
            desired.route.isSet = true;
            break;
        case 'land':
            desired.connect = true;
            desired.takeoff = false;
            desired.land = true;
            desired.route.isSet = true;
            break;
    }
    return desired;
}

function registerShadow (routeId) {
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
            console.log('takeoff route:', routeId);
            var takeoffState = {state: {desired: generateState('takeoff', routeId)}};
            executeOperation('update', takeoffState);
        }
    });
}

function executeOperation(oName, stateObject) {
    console.log('operation name:', oName, 'thingName:', thingName, 'stateObj:', stateObject);
    var clientToken = thingShadows[oName](thingName, stateObject);
    // if token is non-null it gets sent in a status event upon operation completion
    // if token null another operation is in progress
    if (clientToken === null) {
        console.log('execute operation failed, operation in progress');
        if (currentTimeout !== null) {
            currentTimeout = setTimeout(function() {
                executeOperation(oName, stateObject);
            }, operationTimeout * 2);
        }
    } else {
        console.log('execute operation succeeded', clientToken);
        stack.push(clientToken);
    }
}

function handleConnect(routeId) {
    // after connecting to aws iot register interest in thing shadow
    console.log('connected to aws');
    console.log('registering route for id:', testId);
    registerShadow(testId);
}

function handleStatus (thingName, stat, clientToken, stateObject) {
    // reports status completion of update(), get(), and delete() calls
    console.log('got stat', stat, 'for', thingName, 'state:', stateObject);
}

function handleDelta(thingName, stateObject) {
    console.log('delta on', thingName, ':', JSON.stringify(stateObject));
    var isTakeoff = stateObject.state.takeoff;
    if (isTakeoff) {
        console.log('sending land request');
        setTimeout(function() {
            var landState = {state: {desired: generateState('land')}};
            executeOperation('update', landState);
        }, 5000);
    }
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