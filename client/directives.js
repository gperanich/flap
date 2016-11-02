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
        return {
            templateUrl: 'directives/createroute.html',
            restrict: 'E',
            controller: ['$scope', 'Buildings', 'UserService', 'Routes', function($scope, Buildings, UserService, Routes) {
                var user = UserService.me().then(function(success) {
                    user = success.id;
                    $scope.buildings = Buildings.filter({ userid: success.id });
                });

                $scope.routeCommands = [];

                $scope.addRoute = function() {
                    console.log('clicked add route');
                    $scope.routeCommands.push({
                        command: $scope.selectedCommand,
                        amount: $scope.inputAmount
                    });
                }

                $scope.submitRoute = function() {
                    console.log('clicked submit route');
                    var commandString = JSON.stringify($scope.routeCommands);
                    var routeData = {
                        userid: user,
                        buildingid: $scope.selectedBuilding,
                        commands: commandString
                    }
                    var route = new Routes(routeData);
                    route.$save(function(success) {
                        console.log(success);
                    });
                }

                $scope.clearRoute = function() {
                    console.log('clicked claer route');
                    $scope.routeCommands = [];
                }
            }]
        }
    })