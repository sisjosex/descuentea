module.controller('Login', function ($rootScope, $scope, service, $interval, $timeout) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];
        $scope.email = '';
        $scope.login_error = false;
        $scope.error_message = '';

        $scope.loginUser = function() {

            $scope.login_error = false;
            $scope.error_message = '';

            if ( $scope.email == '' ) {

                $scope.login_error = true;
                $scope.error_message = t('login_email_required');

            } else if (!$.trim($scope.email).match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {

                $scope.login_error = true;
                $scope.error_message = t('login_email_invalid');
            }

            if ( !$scope.login_error ) {

                modal.show();

                service.loginUser({email: $scope.email, lang: applicationLanguage}, function(response) {

                    modal.hide();

                    if (response.status == 'success') {

                        saveUser(response.usuario);

                        $rootScope.params = response.params;

                        mainNavigator.pushPage('views/home.html');

                        $rootScope.registerPushNotifications();


                        $rootScope.updateAll();

                    } else {

                        if (response.type == 'normal') {

                            alert(response.message);

                        } else if (response.type == 'logged') {

                            confirm(response.message, function() {

                                service.loginUser({email: $scope.email, lang: applicationLanguage, force: '1'}, function(response) {

                                    saveUser(response.usuario);

                                    $rootScope.params = response.params;

                                    mainNavigator.pushPage('views/home.html');

                                    $rootScope.registerPushNotifications();

                                    $rootScope.updateAll();
                                });
                            });
                        }
                    }

                }, function(){

                });
            }
        };

        $scope.setLanguage = function (l) {

            applicationLanguage = l;

            $scope.labels = lang[applicationLanguage];

            updateLanguage(applicationLanguage);

            if ( getUser() ? getUser.recibir_alertas : false ) {

                $scope.alertas_on_off_text = $scope.labels.dejar_notificaciones;;

            } else {

                $scope.alertas_on_off_text = $scope.labels.recibir_notificaciones;;
            }
        };


        $scope.goToHome = function () {
            mainNavigator.pushPage('home.html');
        };

        $scope.goToInvitado = function () {
            mainNavigator.pushPage('views/home.html');
        };


        try {
            navigator.splashscreen.hide();
        } catch (error) {
        }

    });
});