module.controller('PreRegister', function ($rootScope, $scope, service, $interval, $timeout) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];

        $scope.setLanguage = function (l) {

            applicationLanguage = l;

            $scope.labels = lang[applicationLanguage];

            updateLanguage(applicationLanguage);
        };


        $scope.goToLogin = function () {
            mainNavigator.pushPage('views/login.html');
        };

        $scope.goToRegister = function () {
            mainNavigator.pushPage('views/register.html');
        };

    });
});