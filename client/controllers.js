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
                $(document).ready(function() {
                    console.log('in the jquery handler');
                    $('.building-shape').remove();
                    var createShape = function() {
                        console.log('creating shape');
                        var canvas = $('.shape-div');
                        var Shape = function(width, height) {
                            this.width = width;
                            this.height = height;
                        }
                        Shape.prototype.draw = function() {
                            this.div = $('<div></div>');
                            this.div.addClass('building-shape');
                            this.div.css({
                                position: "relative",
                                background: "rgba(255,0,0,0.5)",
                                width: (this.width * 10) + "px",
                                height: (this.height * 10) + "px",
                                top: "50px",
                                left: "50px"
                            });
                            canvas.append(this.div);
                        }
                        var Rectangle = function(width, height) {
                            Shape.call(this, width, height);
                            this.cssClass = 'new-rectangle';
                            this.draw();
                        }
                        Rectangle.prototype = Object.create(Shape.prototype);
                        Rectangle.prototype.constructor = Rectangle;
                        function createRectangle() {
                            console.log('drawing building');
                            new Rectangle(building.width, building.length);
                        }
                        createRectangle();
                    }

                    createShape();
                })
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


    }])
    .controller('InfoController', ['$scope', function ($scope) {

    }])
    .controller('PastWorkController', ['$scope', function ($scope) {

    }])

    .controller('ContactController', ['$scope', function ($scope) {

        $(document).ready(function () {
           $(".contact-row").delay(75).animate({ opacity: 1 }, 200)
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

// var createShape = function() {
//                 console.log('creating shape');
//                 var canvas = $('#shape-div');
//                 var Shape = function(width, height) {
//                     this.width = width;
//                     this.height = height;
//                 }
//                 Shape.prototype.draw = function() {
//                     this.div = $('<div></div>');
//                     this.div.attr({
//                         background: "rgba(0,0,0,0.5)",
//                         width: this.width + "px",
//                         height: this.height + "px",
//                         top: "50px",
//                         left: "50px"
//                     });
//                     // this.div.style.background = rgba(0,0,0,0.5);
//                     // this.div.style.width = this.width + 'px';
//                     // this.div.style.height = this.height + 'px';
//                     // this.div.style.top = 50 + 'px';
//                     // this.div.style.left = 50 + 'px';
//                     canvas.append(this.div);
//                 }
//                 var Rectangle = function(width, height) {
//                     Shape.call(this, width, height);
//                     this.cssClass = 'new-rectangle';
//                     this.draw();
//                 }
//                 Rectangle.prototype = Object.create(Shape.prototype);
//                 Rectangle.prototype.constructor = Rectangle;
//                 function createRectangle() {
//                     console.log('drawing building');
//                     new Rectangle(building.width, building.length);
//                 }
//                 createRectangle();
// }
