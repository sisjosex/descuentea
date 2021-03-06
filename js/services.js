angular.module("services", []).factory("service", ["$http", "$q", function ($http, $q) {
    return {
        authenticate: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'validarDeviceUuid/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        setCity: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'setCiudad/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getNotifications: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getAlertas/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        onOffNotifications: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'setAlerta/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getMenus: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getMenuDiario/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getMenuDetail: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getMenuDiarioDetalle/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getLocal: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getLocals/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getPlans: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getPlans/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getPlanDetail: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getPlans/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getGuia: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getGuia/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getLocals: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getLocals/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        storeToken: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'storeToken/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        checkDistance: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'checkDistance/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getGalerias: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getGalerias/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getFotosGaleria: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getFotosGaleria/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        getNotificationsCount: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getNotificationsCount/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        loginUser: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'loginUser/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        registerUser: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'registerUser/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        renewSubscription: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'renewSubscription/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        loQuiero: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'loQuiero/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        },
        canjearDescuento: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'canjearDescuento/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).success(success).error(error);
        }
    };
}]);

function checkParams(params) {

    try {

        device;

    } catch (error) {

        device = {
            version: '9.0',
            platform: 'iphone',
            uuid: 'ASDASDASD3'
        }
    }

    params.lang = applicationLanguage;
    params.d_plataforma = device.platform;
    params.d_version = device.version;
    params.d_name = device.platform === 'android' || device.platform === 'Android' ? 'android' : 'iphone';
    params.device_uuid = device.uuid;
    params.token_notificacion = token_notificacion;
    params.onesignal_id = onesignal_id;
    params.lat1 = latitude;
    params.lon1 = longitude;

    if (getUser()) {

        if (!params.ciudad_id) {

            params.ciudad_id = getUser().ciudad_id;
        }

        if (!params.usuario_id) {

            params.usuario_id = getUser().usuario_id;
        }
    }

    return params;
}