module.controller('Renew', function ($rootScope, $scope, service, $interval, $timeout) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];
        $scope.errors = {};
        $scope.user = {
            nombre: $rootScope.getUser().nombre,
            apellido: $rootScope.getUser().apellido,
            email: $rootScope.getUser().email,
            tarjeta: '',
            mes: $scope.labels.mes,
            ano: '',
            acepto: true
        };

        $scope.payed = false;

        $scope.renewSubscription = function () {

            $scope.errors = {};

            var error = false;

            /*if ( $scope.user.nombre == '' ) {

             error = true;
             $scope.errors.nombre = t('login_nombre_required');
             }

             if ( $scope.user.apellido == '' ) {

             error = true;
             $scope.errors.apellido = t('login_apellido_required');
             }*/

            if ($scope.user.tarjeta == '') {

                error = true;
                $scope.errors.tarjeta = t('login_tarjeta_required');
            }

            if ($scope.user.cvc == '') {

                error = true;
                $scope.errors.cvc = t('login_cvc_required');
            }

            if ($scope.user.mes == '' || $scope.user.mes == $scope.labels.mes) {

                error = true;
                $scope.errors.mes = t('login_mes_required');
            }

            if ($scope.user.ano == '') {

                error = true;
                $scope.errors.ano = t('login_ano_required');
            }

            /*if ( $scope.user.acepto == '' ) {

             error = true;
             $scope.errors.acepto = t('login_acepto_required');
             }*/

            /*if ( $scope.user.email == '' ) {

             error = true;
             $scope.errors.email = t('login_email_required');

             } else if (!$.trim($scope.user.email).match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {

             error = true;
             $scope.errors.email = t('login_email_invalid');
             }*/

            if (!error) {

                modal.show();

                var existsStripe = false;

                try {
                    existsStripe = stripe != undefined ? true : false;
                } catch (error) {
                    existsStripe = false;
                }

                if (existsStripe) {

                    if(!$scope.payed) {

                        stripe.charges.create({
                                amount: 39 * 100,
                                currency: 'eur',
                                card: {
                                    number: $scope.user.tarjeta,
                                    exp_month: $scope.user.mes,
                                    exp_year: $scope.user.ano,
                                    cvc: $scope.user.cvc,
                                    name: $scope.user.nombre
                                },
                                description: "Descuentea transfer"
                            },
                            function (result) {

                                var string = '';

                                for (var i in result) {

                                    //string += i + ' -> ' + result[i] + '<br>';

                                    if (i == 'error') {

                                        string = result.error.message;

                                        error = true;

                                        /*for(var j in result.error) {

                                         string += j + ' -> ' + result.error[j] + '<br>';

                                         if (j == 'error') {

                                         }
                                         }*/
                                    }
                                }

                                if (!error) {

                                    $scope.payed = true;

                                    service.renewSubscription($scope.user, function (response) {

                                        if (response.status == 'success') {

                                            modal.hide();

                                            alert(response.message);

                                            saveUser(response.usuario);

                                            //$rootScope.params = response.params;

                                            $scope.$emit('user', response.usuario);
                                            $scope.$emit('getUser');

                                            mainNavigator.popPage({refresh: true});

                                            //$rootScope.registerPushNotifications();

                                            //$rootScope.updateAll();


                                        } else {

                                            modal.hide();

                                            alert(response.message);
                                        }

                                    }, function () {

                                    });

                                } else {

                                    modal.hide();

                                    alert(string);
                                }
                            });

                    } else {

                        service.renewSubscription($scope.user, function (response) {

                            if (response.status == 'success') {

                                modal.hide();

                                alert(response.message);

                                saveUser(response.usuario);

                                //$rootScope.params = response.params;

                                $scope.$emit('user', response.usuario);
                                $scope.$emit('getUser');

                                mainNavigator.popPage({refresh: true});

                                //$rootScope.registerPushNotifications();

                                //$rootScope.updateAll();


                            } else {

                                modal.hide();

                                alert(response.message);
                            }

                        }, function () {

                        });
                    }


                } else {

                    service.renewSubscription($scope.user, function (response) {

                        if (response.status == 'success') {

                            modal.hide();

                            alert(response.message);

                            saveUser(response.usuario);

                            //$rootScope.params = response.params;

                            $scope.$emit('user', response.usuario);
                            $scope.$emit('getUser');

                            mainNavigator.popPage({refresh: true});

                            //$rootScope.registerPushNotifications();

                            //$rootScope.updateAll();


                        } else {

                            modal.hide();

                            alert(response.message);
                        }

                    }, function () {

                    });
                }
            }
        };


        $scope.setLanguage = function (l) {

            applicationLanguage = l;

            $scope.labels = lang[applicationLanguage];

            updateLanguage(applicationLanguage);
        };


        $scope.goToHome = function () {
            mainNavigator.pushPage('home.html');
        };

        $scope.goToPreRegister = function () {
            mainNavigator.pushPage('views/preregister.html');
        };

    });
});