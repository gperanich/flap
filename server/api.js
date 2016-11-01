var express = require('express');
var users = require('./controllers/users.ctrl');
var buildings = require('./controllers/buildings.ctrl');

var router = express.Router();

router.use(function(req, res, next) {
    next();
});

router.use('/users', users);
router.use('/buildings', buildings);

module.exports = router;