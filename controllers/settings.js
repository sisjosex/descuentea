module.controller('Settings', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];

        $scope.alertas_on_off_text = '';

        $scope.city_id = $rootScope.getUser() ? $rootScope.getUser().ciudad_id : $rootScope.city_id;
        $scope.city_name = '';

        $scope.user = $rootScope.getUser();

        $scope.email = '';
        $scope.login_error = false;
        $scope.error_message = '';
        $scope.alertas_on_off_text = '';


        for (var i in $rootScope.params.ciudades) {

            if ($rootScope.params.ciudades[i].id == $scope.city_id) {

                $scope.city_name = $rootScope.params.ciudades[i].title;
            }
        }


        console.log($scope.city_id);


        if ($scope.city_id != '') {

            for (var i in $rootScope.params.ciudades) {
                if ($rootScope.params.ciudades[i].id == $scope.city_id) {

                    $scope.city_name = $rootScope.params.ciudades[i].title;
                }
            }

        } else {

            $scope.city_name = 'Selecciona tu Ciudad';
        }

        if ( getUser() ? getUser.recibir_alertas : false ) {

            $scope.alertas_on_off_text = $scope.labels.dejar_notificaciones;;

        } else {

            $scope.alertas_on_off_text = $scope.labels.recibir_notificaciones;;
        }

        $scope.goToGalerias = function (id, type) {

            mainNavigator.pushPage('galerias.html');
        };

        $scope.goToRenew = function () {

            mainNavigator.pushPage('views/renew.html');
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

        $scope.setCity = function () {

            if( getUser() ) {

                modal.show();

                service.setCity({usuario_id: getUser().id, ciudad_id: $scope.city_id}, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        $rootScope.authenticate(function () {

                            modal.hide();

                            $scope.city_id = getUser().ciudad_id;

                            for (var i in $rootScope.params.ciudades) {

                                if ($rootScope.params.ciudades[i].id == $scope.city_id) {

                                    $scope.city_name = $rootScope.params.ciudades[i].title;
                                }
                            }

                            setTimeout(function () {
                                $('.home .preview').each(function () {
                                    new ImageLoader($(this), new Image());
                                });
                            }, 200);

                            //$rootScope.$apply();

                            //mainNavigator.popPage({refresh: true});

                            alert(result.mensaje);

                        }, function() {

                            modal.hide();
                        });

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function () {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });

            } else {

                $rootScope.city_id = $scope.city_id;

                $rootScope.authenticate(function () {

                }, function() {

                    $scope.city_id = $rootScope.city_id;

                    for (var i in $rootScope.params.ciudades) {

                        if ($rootScope.params.ciudades[i].id == $scope.city_id) {

                            $scope.city_name = $rootScope.params.ciudades[i].title;
                        }
                    }

                    setTimeout(function () {
                        $('.home .preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });
                    }, 200);

                    $rootScope.updateAll();

                    //alert(result.mensaje);
                });
            }
        };

        $scope.onOffNotifications = function () {

            modal.show();

            service.onOffNotifications({usuario_id: getUser().id}, function (result) {

                if (result.status == 'success') {

                    user = getUser();
                    user.recibir_alertas = result.recibir_alertas;
                    saveUser(user);

                    if (result.recibir_alertas) {

                        $scope.alertas_on_off_text = 'Dejar de recibir notificaciones';

                    } else {

                        $scope.alertas_on_off_text = 'Recibir notificaciones';

                    }

                    modal.hide();

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

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

                service.loginUser({email: $scope.email, lang: applicationLanguage}, function(response) {


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

        $scope.back = function() {

            mainNavigator.popPage({refresh: true});
        };

    });
});