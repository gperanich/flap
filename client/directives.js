angular.module('DroneApp.directives', [])
    .directive('customNavbar', function () {
        return {
            templateUrl: 'directives/navbar.html',
            restrict: 'E',
            controller: ['$scope', '$rootScope', 'UserService', '$location', function ($scope, $rootScope, UserService, $location) {
                $scope.logout = function() {
                    console.log('clicked logout');
                    UserService.logout().then(function(success) {
                        $location.url('/');
                    });
                }
            }]
        };
    })
    .directive('createRoute', function() {
        return{
            templateUrl: 'directives/createRoute.html',
            restrict: 'E',
            controller: ['$scope', function($scope) {

            }]
        }
    })