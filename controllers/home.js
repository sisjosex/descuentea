
var homeSliderInterval = false;
module.controller('Home', function ($rootScope, $scope, service, $interval, $timeout) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];

        $scope.total_notifications = 0;

        $scope.goToPlans = function () {
            mainNavigator.pushPage('views/plans.html');
        };

        $scope.goToNotifications = function () {
            mainNavigator.pushPage('notifications.html', {animation: 'fade'});
        };

        $scope.goToSettings = function () {
            mainNavigator.pushPage('views/settings.html');
        };

        $scope.goToGuia = function () {
            mainNavigator.pushPage('guia.html');
        };

        $scope.gotoDailyMenus = function () {
            mainNavigator.pushPage('daily_menus.html');
        };

        $scope.gotoComoFunciona = function () {
            mainNavigator.pushPage('como_funciona.html');
        };

        $scope.test = function () {
            console.log('test');
        };

        $scope.getNotificationsCount = function () {

            service.getNotificationsCount({usuario_id: getUser() ? getUser().id : ''}, function (result) {

                if (result.status == 'success') {

                    $scope.total_notifications = result.data;

                } else if (result.status == 'logged') {

                    alert(result.message);

                    saveUser(false);
                    mainNavigator.pushPage('views/login_logout.html');

                } else {

                    alert('No se pudo conectar con el servidor');
                }

            }, function (error) {
            })
        };


        $interval($scope.getNotificationsCount, 10000);
        $scope.getNotificationsCount();


        $scope.current_carousel_index = 0;

        setTimeout(function () {

            $($(mainNavigator).find('.preview')[0]).each(function () {

                new ImageLoader($(this), new Image(), function () {

                    $($(mainNavigator.topPage).find('.preview')).each(function () {
                        new ImageLoader($(this), new Image());
                    });

                    homeCarousel.on('postchange', function () {

                        $scope.current_carousel_index = homeCarousel.getActiveIndex();
                        $scope.$digest();
                    });

                    if (!homeSliderInterval) {
                        homeSliderInterval = true;

                        var currentCicle = 0;

                        setInterval(function () {

                            if (currentCicle != 0) {

                                if (homeCarousel.getActiveIndex() + 1 == $rootScope.params.slider.length) {

                                    if ($($(mainNavigator.topPage).find('.home-carousel div.preview')[0]).hasClass('loaded')) {

                                        homeCarousel.first({
                                            animation: "none"
                                        });
                                    }

                                } else {

                                    if ($($(mainNavigator.topPage).find('.home-carousel div.preview')[homeCarousel.getActiveIndex() + 1]).hasClass('loaded')) {

                                        homeCarousel.next();
                                    }
                                }
                            }

                            currentCicle++;

                        }, 5000);
                    }

                    try {
                        navigator.splashscreen.hide();
                    } catch (error) {
                    }
                });
            });

        }, 1500);

    });
});