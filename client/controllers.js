angular.module('DroneApp.controllers', [])
.controller('WelcomeController', ['$scope', function($scope) {
    console.log('Welcome!')
}])
.controller('InfoController', ['$scope', function($scope) {

}])
.controller('PastWorkController', ['$scope', function($scope) {

}])
.controller('LogInController', ['$scope', 'UserService', '$location', function($scope, UserService, $location) {
    UserService.me().then(function(success) {
        redirect();
    });
    function redirect() {
        var dest = $location.search().p;
        if (!dest) {
            dest='/';
        }
        $location.path(dest).search('p', null).replace();
    }
    $scope.login = function() {
        UserService.login($scope.email, $scope.password)
        .then(function() {
            redirect();
        }, function(err) {
            onsole.log(err);
        });
    }
}])
.controller('AccountController', ['$scope', function($scope) {

}])
