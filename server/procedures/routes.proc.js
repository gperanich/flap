var db = require('../config/db');

exports.all = function() {
    return db.rows('GetRoutes');
}
exports.read = function(id) {
    return db.row('GetRoute', [id]);
}
exports.create = function(routeid, command, amount) {
    return db.row('NewRoute', [routeid, command, amount]);
}