var db = require('../config/db');

exports.all = function() {
    return db.rows('GetBuildings');
}
exports.read = function(id) {
    return db.row('GetBuilding', [id]);
}
exports.create = function(buildingid, height, width, length) {
    return db.row('NewBuilding', [buildingid, height, width, length]);
}