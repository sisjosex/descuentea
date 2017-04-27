module.controller('Plans', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.plans = [];
        $scope.categories = [];
        $scope.category_id = '';
        $scope.day = '';
        $scope.menu_type = '';

        $scope.city_id = $rootScope.getUser() ? $rootScope.getUser().ciudad_id : $rootScope.city_id;

        $scope.labels = lang[applicationLanguage];

        $scope.search = function (category_id) {

            $scope.category_id = category_id;

            rightSplitter.toggle();

            $scope.getPlans();
        };

        $scope.searchByDay = function(day) {

            $scope.day = day;

            rightSplitter.toggle();

            $scope.getPlans();
        };

        $scope.filterByType = function (type) {

            $scope.menu_type = type;

            $scope.getMenus();
        };

        $scope.getPlans = function () {

            modal.show();

            service.getPlans({
                usuario_id: $rootScope.getUser().id,
                ciudad_id: $scope.city_id,
                category_id: $scope.category_id,
                menu_type: $scope.menu_type,
                day: $scope.day
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    if (result.items.length == 0) {
                        alert('Lo sentimos, no tenemos planes para mostrar  ');
                    }

                    $scope.plans = result.items;
                    if ($scope.categories.length == 0) {
                        $scope.categories = result.categorias;
                    }

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

        setTimeout(function () {
            $scope.getPlans();
        }, 600);


        $scope.available = function(plan) {

            return getUser() != false && plan.usuario_estado == 'reservar';
        };

        $scope.reservado = function(plan) {

            return getUser() != false && (plan.usuario_estado == 'reservado' || plan.usuario_estado == 'pagado');
        };

        $scope.canjeable = function(plan) {

            return getUser() != false && (plan.usuario_estado == 'reservado');
        };

    });
});