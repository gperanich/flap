angular.module('DroneApp.controllers', [])
    .controller('WelcomeController', ['$scope', function ($scope) {
        console.log('Welcome!')

        var vid = document.getElementById("bgvid");

    }])
    .controller('LoginController', ['$scope', 'UserService', '$location', function ($scope, UserService, $location) {
        UserService.me().then(function (success) {
            redirect();
        });
        function redirect() {
            var dest = $location.search().p;
            if (!dest) {
                dest = '/';
            }
            $location.path(dest).search('p', null).replace();
        }
        $scope.login = function () {
            console.log('clicked login');
            UserService.login($scope.email, $scope.password)
                .then(function (success) {
                    console.log('logged in!');
                    redirect();
                }, function (err) {
                    console.log(err);
                });
        }

        $(document).ready(function () {
           $(".user-creator-login").delay(75).animate({ opacity: 1 }, 200)


        })

    }])
    .controller('AccountController', ['$scope', 'Buildings', 'UserService', 'Routes', function($scope, Buildings, UserService, Routes) {
            $scope.showDetails = function(building) {
                console.log('clicked to see building details');
                building.hideDetails = !building.hideDetails;
            };
            $scope.showRoutes = function(building) {
                console.log('clicked to see routes');
                building.hideRoutes = !building.hideRoutes;
                if (!building.hideRoutes) {
                    console.log(building);
                    building.routes = Routes.building({ buildingid: building.id });
                    console.log(building.routes);
                }
            };


            var user = UserService.me().then(function(success) {
                user = success.id;
                $scope.buildings = Buildings.filter({ userid: success.id });
                console.log($scope.buildings);
            });

            $scope.createBuilding = function() {
                var buildingData = {
                    userid: user,
                    name: $scope.buildingName,
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
    // .controller('RouteController', ['$scope', 'Routes', function($scope, Routes) {

    // }])
    .controller('InfoController', ['$scope', function ($scope) {

    }])
    .controller('PastWorkController', ['$scope', function ($scope) {

    }])

    .controller('ContactController', ['$scope', function ($scope) {
        $(document).ready(function () {
           $(".user-creator").delay(75).animate({ opacity: 1 }, 200)
        })
    }])
    .controller('RegisterController', ['$scope', 'Users', '$location', function ($scope, Users, $location) {
        $scope.newUser = function () {
            var userData = {
                firstname: $scope.firstname,
                lastname: $scope.lastname,
                email: $scope.email,
                password: $scope.password
            };
            var user = new Users(userData);
            user.$save(function (success) {
                $location.url('/');
            });
        }
        
        $(document).ready(function () {
           $(".user-creator").delay(75).animate({ opacity: 1 }, 200)
        })

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
