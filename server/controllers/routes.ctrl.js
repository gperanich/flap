var express = require('express');
var procedures = require('../procedures/routes.proc');
var passport = require('passport');
var utils = require('../utils');
var auth = require('../middleware/auth.mw');

var router = express.Router();

router.route('/')
    .get(function(req, res) {
        procedures.all().then(function(routes) {
            res.send(routes);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    })
    .post(function(req, res) {
        console.log(req.body);
        procedures.create(req.body.userid, req.body.buildingid, req.body.commands).then(function(route) {
            console.log(route);
            res.send(route);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        })
    });

router.route('/:id')
    .get(function(req, res) {
        procedures.read(req.params.id).then(function(route) {
            res.send(route);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

module.exports = router;