angular.module('DroneApp.factories', [])
.factory('Users', ['$resource', function($resource) {
    return $resource('http://localhost:3000/api/users/:id', { id:'@id' });
}])
.factory('Buildings', ['$resource', function($resource) {
    return $resource('http://localhost:3000/api/buildings/:id', { id:'@id' });
}])
.factory('Routes', ['$resource', function($resource) {
    return $resource('http://localhost:3000/api/routes/:id', { id:'@id' })
}])