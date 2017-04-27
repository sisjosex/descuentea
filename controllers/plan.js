module.controller('Plan', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];

        $scope.plan_id = mainNavigator.pages[mainNavigator.pages.length - 1].data.plan_id;
        $scope.plan = {};

        $scope.loQuiero = function (plan) {

            modal.show();

            service.loQuiero({promocion_id: plan.id, usuario_id: $rootScope.getUser().id}, function (result) {

                if (result.status == 'success') {

                    alert(result.message);

                    $scope.getPlanDetail();

                } else {

                    alert(result.message);
                }

            }, function (error) {
            })
        };

        $scope.canjearDescuento = function (discount_id) {

            confirm(t('estas_seguro'), function(){

                modal.show();

                service.canjearDescuento({discount_id: discount_id, usuario_id: $rootScope.getUser().id}, function (result) {

                    if (result.status == 'success') {

                        alert(result.message);

                        $scope.getPlanDetail();

                    } else {

                        alert(result.message);
                    }

                }, function (error) {
                });

            });
        };

        $scope.getPlanDetail = function () {

            modal.show();

            service.getPlanDetail({usuario_id: $rootScope.getUser().id, plan_id: $scope.plan_id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.plan = result.items;

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getPlanDetail();

        /*setTimeout(function () {

            var fixed = mainNavigator.topPage.querySelector('.fixed');

            var list = mainNavigator.topPage.querySelector(".page__content");

            list.addEventListener("scroll", function (event) {

                if (list.scrollTop > 150) {

                    $(mainNavigator.topPage).addClass('scrolled');

                } else {

                    $(mainNavigator.topPage).removeClass('scrolled');
                }

            });

        }, 200);*/

        $scope.available = function(plan) {

            return $rootScope.getUser() != false && plan.usuario_estado == 'reservar';
        };

        $scope.reservado = function(plan) {

            return $rootScope.getUser() != false && plan.usuario_estado == 'reservado';
        };

        $scope.back = function() {

            mainNavigator.popPage({refresh: true});
        };

    });
});