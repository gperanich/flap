angular.module('DroneApp.controllers', [])
    .controller('WelcomeController', ['$scope', function ($scope) {
            console.log('Welcome!')

            var vid = document.getElementById("bgvid");
            var pauseButton = document.querySelector("#polina button");

    }])
    .controller('LoginController', ['$scope', 'UserService', '$location', function($scope, UserService, $location) {
        console.log('login page loaded');
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
            console.log('clicked login');
            UserService.login($scope.email, $scope.password)
            .then(function(success) {
                console.log('logged in!');
                redirect();
            }, function(err) {
                console.log(err);
            });
        }
    }])
    .controller('AccountController', ['$scope', 'Buildings', 'UserService', function($scope, Buildings, UserService) {
            var user = UserService.me().then(function(success) {
                console.log(success.id);
                user = success.id;
                console.log(user);
            });
            console.log(user);

            $scope.createBuilding = function() {
                var buildingData = {
                    userid: user,
                    height: $scope.height,
                    width: $scope.width,
                    length: $scope.length
                };
                console.log(user);
                var building = new Buildings(buildingData);
                building.$save(function(success) {
                    console.log(success);
                });
            }


    }])
    .controller('InfoController', ['$scope', function ($scope) {

    }])
    .controller('PastWorkController', ['$scope', function ($scope) {

    }])
    .controller('RegisterController', ['$scope', 'Users', '$location', function($scope, Users, $location) {
        $scope.newUser = function() {
            var userData = {
                firstname: $scope.firstname,
                lastname: $scope.lastname,
                email: $scope.email,
                password: $scope.password
            };
            var user = new Users(userData);
            user.$save(function(success) {
                $location.url('/');
            });
        }
    }])
    
            // function vidFade() {
            //     vid.classList.add("stopfade");
            // }

            // vid.addEventListener('ended', function () {
            //     // only functional if "loop" is removed 
            //     vid.pause();
            //     // to capture IE10
            //     vidFade();
            // });


            // pauseButton.addEventListener("click", function () {
            //     vid.classList.toggle("stopfade");
            //     if (vid.paused) {
            //         vid.play();
            //         pauseButton.innerHTML = "Pause";
            //     } else {
            //         vid.pause();
            //         pauseButton.innerHTML = "Paused";
            //     }
            // });
