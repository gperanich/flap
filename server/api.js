var express = require('express');
var users = require('./controllers/users.ctrl');

var router = express.Router();

router.use(function(req, res, next) {
    next();
});

router.use('/users', users);

module.exports = router;