angular.module('DroneApp', ['ngRoute', 'ngResource', 'DroneApp.controllers', 'DroneApp.directives'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeController'
    })
    .when('/info', {
        templateUrl: 'views/info.html',
        controller: 'InfoController'
    })
    .when('/past_work', {
        templateUrl: 'views/pastWork.html',
        controller: 'PastWorkController'
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LogInController'
    })
    .when('/account_home', {
        templateUrl: 'account.html',
        controller: 'AccountController'
    })
    .otherwise({
        redirectTo: '/'
    })
}]);