angular.module('DroneApp.controllers', [])
    .controller('WelcomeController', ['$scope', function ($scope) {
        console.log('Welcome!')

        var vid = document.getElementById("bgvid");
        var pauseButton = document.querySelector("#polina button");

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
        function vidFade() {
            vid.classList.add("stopfade");
        }

        vid.addEventListener('ended', function () {
            // only functional if "loop" is removed 
            vid.pause();
            // to capture IE10
            vidFade();
        });


        pauseButton.addEventListener("click", function () {
            vid.classList.toggle("stopfade");
            if (vid.paused) {
                vid.play();
                pauseButton.innerHTML = "Pause";
            } else {
                vid.pause();
                pauseButton.innerHTML = "Paused";
            }
        })


    }])
    .controller('InfoController', ['$scope', function ($scope) {

    }])
    .controller('PastWorkController', ['$scope', function ($scope) {

    }])
    .controller('LogInController', ['$scope', function ($scope) {

    }])
    .controller('AccountController', ['$scope', function ($scope) {

    }])
