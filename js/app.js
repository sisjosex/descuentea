var API_URL = 'http://web.queplanmadrid.es/api2/';
var WEB_URL = 'http://web.queplanmadrid.es/';

var module = ons.bootstrap('MyApp', ['services', 'ngSanitize']);

var applicationLanguage = 'es';
var user;
var user_storage_key = 'descuentea_user';
var currentNavigator = undefined;
var token_notificacion;
var onesignal_id;
var latitude;
var longitude;

var rootScope;

module.controller('MainNavigatorController', function ($scope, $rootScope, service, $sce) {

    ons.ready(function () {

        rootScope = $rootScope;

        $rootScope.params = {
            ciudades: [],
            slider: [],
            usuario: {},
        };

        $rootScope.city_id = 3;

        $rootScope.formatDate = function(txt) {

            date = new Date(txt);

            //DÍA / MES / AÑO

            //return txt;

            return  (date.getDate() + 1) + '/' + ( date.getMonth() + 1 ) + '/' + date.getFullYear();
        };

        $rootScope.getUser = function() {

            //if (user == undefined) {

            if (localStorage.getItem(user_storage_key) != null && localStorage.getItem(user_storage_key) != undefined && localStorage.getItem(user_storage_key) != '' && localStorage.getItem(user_storage_key) != 'undefined') {

                user = JSON.parse(localStorage.getItem(user_storage_key));

            } else {

                user = undefined;
            }
            //}

            return user;
        };

        $rootScope.getUser2 = function() {

            //if (user == undefined) {

            if (localStorage.getItem(user_storage_key) != null && localStorage.getItem(user_storage_key) != undefined && localStorage.getItem(user_storage_key) != '' && localStorage.getItem(user_storage_key) != 'undefined') {

                user = JSON.parse(localStorage.getItem(user_storage_key));

            } else {

                user = undefined;
            }
            //}

            return user;
        };

        $rootScope.playVideo = function (video_id) {

            YoutubeVideoPlayer.openVideo(video_id);
        };

        $rootScope.showImage = function (url) {

            //PhotoViewer.show(url, '', {share:false, done: 'Cerrar'});
        };

        $rootScope.showImage2 = function (url) {

            PhotoViewer.show(url, '', {share: false, done: 'Cerrar'});
        };

        $rootScope.call = function (phone) {

            if (phone) {

                phonedialer.dial(
                    phone,
                    function (err) {
                        if (err == "empty") {
                            alert("Unknown phone number");
                        }
                        else alert("Dialer Error:" + err);
                    },
                    function (success) {
                        //alert('Dialing succeeded');
                    }
                );
            }
        };

        $rootScope.share = function (data, type) {

            if (type == 'plan') {

                var html = data.descripcion;
                var div = document.createElement("div");
                div.innerHTML = html;

                //window.plugins.socialsharing.share('Message and link', null, null, 'http://www.x-services.nl');

                //window.plugins.socialsharing.share(data.title + ' ' + div.innerText, null, data.image, null);

                /*window.plugins.socialsharing.shareViaFacebook(data.title + ' ' + div.innerText, null, null, function() {

                 }, function(errormsg) {
                 //alert(errormsg);
                 });*/

                window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(data.title + ' ' + div.innerText, null /* img */, null /* url */, 'Post!', function () {
                    console.log('share ok');
                }, function (errormsg) {
                    alert(errormsg);
                });

                /*var options = {
                 message: data.title + ' ' + div.innerText, // not supported on some apps (Facebook, Instagram)
                 subject: data.fecha, // fi. for email
                 files: [data.image],
                 //files: ['', ''], // an array of filenames either locally or remotely
                 //url: 'http://web.queplanmadrid.es/',
                 chooserTitle: 'Comparte este plan' // Android only, you can override the default share sheet title
                 };

                 var onSuccess = function (result) {
                 console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                 console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                 };

                 var onError = function (msg) {
                 console.log("Sharing failed with message: " + msg);
                 };

                 window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

                 */
            }
        };

        $rootScope.initGeolocation = function () {

            var onSuccess = function (position) {
                console.log('Latitude: ' + position.coords.latitude + '\n' +
                    'Longitude: ' + position.coords.longitude + '\n' +
                    'Altitude: ' + position.coords.altitude + '\n' +
                    'Accuracy: ' + position.coords.accuracy + '\n' +
                    'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                    'Heading: ' + position.coords.heading + '\n' +
                    'Speed: ' + position.coords.speed + '\n' +
                    'Timestamp: ' + position.timestamp + '\n');

                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                localStorage.setItem('latitude', latitude);
                localStorage.setItem('longitude', longitude);
            };

            // notificar si esta cerca de algun local
            var onSuccessTracking = function (position) {

                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                localStorage.setItem('latitude', latitude);
                localStorage.setItem('longitude', longitude);

                service.checkDistance({usuario_id: getUser().id}, function (result) {

                    if (result.status == 'success') {

                        //alert(result.mensaje);

                    } else {

                        //alert(result.mensaje);
                    }

                }, function (error) {
                })
            };

            // onError Callback receives a PositionError object
            //
            function onError(error) {
                console.log('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);

            var watchId = navigator.geolocation.watchPosition(onSuccessTracking,
                onError,
                {timeout: 30000});
        };

        $rootScope.updateAll = function() {

            for(var i in mainNavigator.pages) {

            };

            setTimeout(function(){

                //$rootScope.$apply();
            }, 200);

            $(mainNavigator).find('.preview').each(function () {
                new ImageLoader($(this), new Image());
            });
        };

        $rootScope.shareByEmail = function (message) {

            shareByEmail(message, function () {
            });
        };

        $rootScope.shareBySMS = function (message) {
            shareBySMS(message, function () {
            });
        };

        $rootScope.shareByWhatsApp = function (message) {
            shareByWhatsApp(message, function () {
            });
        };

        $rootScope.shareByFacebook = function (message) {
            shareByFacebook(message, function () {
            });
        };

        $rootScope.shareBy = function (message, url) {
            shareBy(message, url);
        };

        $rootScope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        $rootScope.openPage = function (url) {
            var ref = window.open(url, '_blank', 'location=no,closebuttoncaption=Cerrar');
        };

        $rootScope.openLocation = function (data) {
            /*
             z is the zoom level (1-20)
             t is the map type ("m" map, "k" satellite, "h" hybrid, "p" terrain, "e" GoogleEarth)
             q is the search query, if it is prefixed by loc: then google assumes it is a lat lon separated by a +
             */
            var ref = window.open('http://maps.google.com/maps?z=12&t=m&q=loc:' + data.latitud + '+' + data.longitud, '_blank', 'location=no,closebuttoncaption=Cerrar');
        };

        $scope.goToPreRegister = function () {
            mainNavigator.pushPage('views/preregister.html');
        };

        $scope.noGetUser = function() {

            return getUser() == false;
        };


        $rootScope.registerPushNotifications = function () {

            var notificationOpenedCallback = function (data) {

                data = data.notification.payload.additionalData;

                console.log(data);

                var message = data.message;
                var seccion = data.seccion;
                var seccion_id = data.seccion_id;

                console.log(data);

                if (data.seccion) {

                    $rootScope.redirectToPage(data.seccion, data.seccion_id);

                } else {

                    alert(message);
                }
            };

            if (window.plugins && window.plugins.OneSignal) {

                window.plugins.OneSignal
                    .startInit("e4f3e63e-47bd-45e3-b30a-3b0a4059e299"/*, "671857502263"*/)
                    .handleNotificationOpened(notificationOpenedCallback)
                    //.inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
                    .endInit();

                window.plugins.OneSignal.getIds(function (ids) {
                    console.log('getIds: ' + JSON.stringify(ids));
                    //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);

                    token_notificacion = ids.pushToken;
                    onesignal_id = ids.userId;

                    localStorage.setItem('queplan_push_token', token_notificacion);

                    $rootScope.authenticate(function () {
                    });
                });
            }
        };


        $rootScope.redirectToPage = function (seccion, id) {

            if (!id || id == undefined || id == null || id == '') {
                id = '';
            }

            if (seccion == "local") {

                if (id == "") {

                    current_page = '';

                    mainNavigator.pushPage('guia.html', {data: {category_id: 1}});

                } else {

                    $rootScope.goToLocal(id, 'restaurant');
                }

            } else if (seccion == "plan") {

                if (id == "") {

                    mainNavigator.pushPage('views/plans.html');

                } else {


                    //$rootScope.goToPlan(id);

                    mainNavigator.pushPage('views/plan.html', {data: {plan_id: id}});
                }

            } else if (seccion == "menu") {

                if (id == "") {

                    mainNavigator.pushPage('daily_menus.html');

                } else {

                    mainNavigator.pushPage('menu_detail.html', {
                        data: {
                            menu: {
                                id: id
                            }
                        }
                    });
                }

            } else if (seccion == "guia") {

                if (id == "") {

                    mainNavigator.pushPage('guia.html');

                } else {

                    mainNavigator.pushPage('locals.html', {data: {category_id: id}});
                }
            }
        };


        $rootScope.goToLocal = function (id, type) {

            if (type == 'restaurant') {

                mainNavigator.pushPage('local_restaurant.html', {data: {local_id: id}});

            } else if (type == 'shopping') {

                mainNavigator.pushPage('local_shop.html', {data: {local_id: id}});

            } else if (type == 'other') {

                mainNavigator.pushPage('local_other.html', {data: {local_id: id}});

            } else {

                $rootScope.redirectToPage('local', id);
            }
        };


        $rootScope.goToPlan = function (id) {

            if (id) {

                mainNavigator.pushPage('views/plan.html', {data: {plan_id: id}});

            } else {

                $rootScope.redirectToPage('plan');
            }
        };


        $rootScope.authenticate = function (callback, error) {

            var params = {usuario_id: getUser() ? getUser().id : ''};

            if ( !getUser() ) {

                params = {usuario_id: getUser() ? getUser().id : '', ciudad_id: $rootScope.city_id};
            }

            service.authenticate(params, function (result) {

                if (result.status == 'success') {

                    console.log(result);

                    saveUser(result.usuario);

                    $rootScope.params = result.params;

                    setTimeout(function () {
                        $rootScope.$digest();
                    }, 500);

                    callback();

                } else {

                    $rootScope.params = result.params;

                    error ? error() : '';
                }

            }, function (error) {
            })
        };

        $rootScope.initAppsFlyer = function () {

            if (window.plugins && window.plugins.appsFlyer) {

                var args = {};
                var devKey = "oTH8LDt5vHrRbhXqKHBeBP";   // your AppsFlyer devKey
                //args.push(devKey);
                args['devKey'] = devKey;
                var userAgent = window.navigator.userAgent.toLowerCase();

                if (/iphone|ipad|ipod/.test(userAgent)) {
                    var appId = "766049348";            // your ios app id in app store
                    //args.push(appId);
                    args['appId'] = appId;
                }
                window.plugins.appsFlyer.initSdk(args, function () {

                    console.log('app flyer initialized - success');

                }, function () {

                    console.log('app flyer initialized - falied');
                });
            }

        };

        $scope.deviceReady = false;

        if (document.location.protocol == 'http:') {

            //API_URL = 'http://localhost/descuentea/admin/api2/';
            API_URL = 'http://admin.descuentea.com/app/webroot/api/api2/';

            setTimeout(onDeviceReady, 500);

        } else {

            API_URL = 'http://admin.descuentea.com/app/webroot/api/api2/';

            document.addEventListener("deviceready", onDeviceReady, false);
        }

        function onDeviceReady() {

            //StatusBar.show();

            $scope.$apply(function () {

                document.addEventListener("online", onOnline, false);
                document.addEventListener("offline", onOffline, false);

                $scope.deviceReady = true;

                applicationLanguage = ( localStorage.getItem('lang') ) ? localStorage.getItem('lang') : 'es';

                localStorage.setItem('lang', applicationLanguage);


                token_notificacion = localStorage.getItem('queplan_push_token');
                latitude = localStorage.getItem('latitude');
                longitude = localStorage.getItem('longitude');

                $rootScope.authenticate(function (response) {

                    mainNavigator.pushPage('views/home.html', {animation: 'none'});

                    $rootScope.registerPushNotifications();

                }, function() {

                    saveUser(false);

                    mainNavigator.pushPage('views/login.html', {animation: 'none'});
                    //mainNavigator.pushPage('views/settings.html', {animation: 'none'});

                    $rootScope.registerPushNotifications();
                });

                $rootScope.initGeolocation();

                $rootScope.initAppsFlyer();

            });
        }

        function onOnline() {
            $rootScope.online = true;
        }

        function onOffline() {
            $rootScope.online = false;
        }

    });
});

function onResize() {


}

var ciudadesIntervals = false;
module.controller('Cities', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.setCity = function (id) {

            modal.show();

            service.setCity({usuario_id: getUser().id, ciudad_id: id}, function (result) {

                if (result.status == 'success') {

                    saveUser(result.user);

                    $rootScope.authenticate(function () {
                    });

                    modal.hide();

                    mainNavigator.pushPage('home.html');

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

            $(mainNavigator.topPage).find('.preview').each(function () {
                new ImageLoader($(this), new Image(), function () {

                    try {
                        navigator.splashscreen.hide();
                    } catch (error) {
                    }
                });
            });

        }, 1000);

    });
});

module.controller('Notifications', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.notifications = [];

        $scope.getNotifications = function () {

            modal.show();

            service.getNotifications({usuario_id: $rootScope.getUser().id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.notifications = result.data;

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
            $scope.getNotifications();
        }, 600);
    });
});

module.controller('Galerias', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.galerias = [];

        $scope.goToGaleriaDetalle = function (galeria) {

            mainNavigator.pushPage('galeria_detalle.html', {data: {galeria: galeria}});
        };

        $scope.getGalerias = function () {

            modal.show();

            service.getGalerias({
                usuario_id: $rootScope.getUser().id,
                ciudad_id: $rootScope.getUser().ciudad_id
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    if (result.data.length == 0) {

                        alert('¡Ups! No hay galerias en estos momentos.');
                    }

                    $scope.galerias = result.data;

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
            $scope.getGalerias();
        }, 600);
    });
});

module.controller('GaleriaDetalle', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.galeria = mainNavigator.pages[mainNavigator.pages.length - 1].data.galeria;

        $scope.fotos = [];

        $scope.getFotosGaleria = function () {

            modal.show();

            service.getFotosGaleria({
                usuario_id: $rootScope.getUser().id,
                ciudad_id: $rootScope.getUser().ciudad_id,
                galeria_id: $scope.galeria.id
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    if (result.data.length == 0) {

                        alert('¡Ups! No hay fotos en estos momentos.');
                    }

                    $scope.fotos = result.data;

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
            $scope.getFotosGaleria();
        }, 600);
    });
});

module.controller('DailyMenus', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.menus = [];
        $scope.categories = [];
        $scope.category_id = '';
        $scope.menu_type = '';

        $scope.search = function (category_id) {

            $scope.category_id = category_id;

            rightSplitter.toggle();

            $scope.getMenus();
        };

        $scope.filterByType = function (type) {

            $scope.menu_type = type;

            $scope.getMenus();
        };

        $scope.goToMenuDetail = function (menu) {

            mainNavigator.pushPage('menu_detail.html', {data: {menu: menu}});
        };

        $scope.getMenus = function () {

            modal.show();

            service.getMenus({
                usuario_id: $rootScope.getUser().id,
                ciudad_id: $rootScope.getUser().ciudad_id,
                category_id: $scope.category_id,
                menu_type: $scope.menu_type
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    if (result.items.length == 0) {

                        if ($scope.category_id != '') {

                            alert(' ¡Ups! Todavía no tenemos ningún restaurante de esta categoría. ¡Prueba en otra!');

                        } else {

                            if ($scope.menu_type == 'menu') {

                                alert('¡Ups! Nuestros clientes hoy no han subido el menú del día. Puedes llamar al local para consultarlo.');

                            } else if ($scope.menu_type == 'carta') {

                                alert('¡Ups! No hay ninguna carta online en estos momentos.');

                            } else {

                                alert('¡Ups! Nuestros clientes hoy no han subido el menú del día. Puedes llamar al local para consultarlo.');
                            }
                        }
                    }

                    $scope.menus = result.items;
                    $scope.categories = result.categorias;

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
            $scope.getMenus();
        }, 600);
    });
});

module.controller('MenuDetail', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.menu_type = 'menu';

        $scope.menu = mainNavigator.pages[mainNavigator.pages.length - 1].data.menu;

        $scope.filterByType = function (type) {

            var existMenus;

            try {

                existMenus = $scope.menu.menu && ($scope.menu.menu.content.primeros != '' || $scope.menu.menu.content.segundos != '' || $scope.menu.menu.content.postres);

            } catch (error) {

                existMenus = false;
            }

            var existsCarta = $scope.menu.carta.length > 0;

            if (type == 'menu' && !existMenus) {

                alert('¡Ups! Este restaurante todavía no ha subido el menú del día.');

            } else if (type == 'carta' && !existsCarta) {

                alert(' ¡Ups! Este restaurante todavía no tiene disponible su carta online.');
            }

            $scope.menu_type = type;
        };

        $scope.getMenuDetail = function () {

            modal.show();

            service.getMenuDetail({usuario_id: $rootScope.getUser().id, local_id: $scope.menu.id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.menu = result.data;

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

        $scope.getMenuDetail();

        setTimeout(function () {

            var fixed = mainNavigator.topPage.querySelector('.fixed');

            var list = mainNavigator.topPage.querySelector(".page__content");

            list.addEventListener("scroll", function (event) {

                if (list.scrollTop > 200) {

                    $(mainNavigator.topPage).addClass('scrolled');

                } else {

                    $(mainNavigator.topPage).removeClass('scrolled');
                }

            });

        }, 200);
    });
});

module.controller('Local', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.menu_type = 'menu';
        $scope.section = 'info';

        $scope.current_carousel_index = 0;

        $scope.local_id = mainNavigator.pages[mainNavigator.pages.length - 1].data.local_id;

        $scope.filterByType = function (type) {

            var existMenus;

            try {

                existMenus = $scope.local.menu && ($scope.local.menu.content.primeros != '' || $scope.local.menu.content.segundos != '' || $scope.local.menu.content.postres);

            } catch (error) {

                existMenus = false;
            }
            var existsCarta = $scope.local.carta.length > 0;

            if (type == 'menu' && !existMenus) {

                alert('¡Ups! Este restaurante todavía no ha subido el menú del día.');

            } else if (type == 'carta' && !existsCarta) {

                alert(' ¡Ups! Este restaurante todavía no tiene disponible su carta online.');
            }

            $scope.section = type;
        };

        $scope.getLocal = function () {

            modal.show();

            service.getLocal({usuario_id: $rootScope.getUser().id, local_id: $scope.local_id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.local = result.data;

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

        $scope.getLocal();

        setTimeout(function () {

            homeCarousel.on('postchange', function () {

                $scope.current_carousel_index = localCarousel.getActiveIndex();
                $scope.$digest();
            });

            var fixed = mainNavigator.topPage.querySelector('.fixed');

            var list = mainNavigator.topPage.querySelector(".page__content");

            list.addEventListener("scroll", function (event) {

                if (list.scrollTop > 200) {

                    $(mainNavigator.topPage).addClass('scrolled');

                } else {

                    $(mainNavigator.topPage).removeClass('scrolled');
                }

            });

        }, 200);
    });
});

module.controller('ComoFunciona', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.como_funciona = $rootScope.params.como_funciona;

        $scope.goToComoFuncionaDetalle = function (index) {

            mainNavigator.pushPage('como_funciona_detalle.html', {data: {index: index}});
        };

    });
});

module.controller('ComoFuncionaDetalle', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.como_funciona = $rootScope.params.como_funciona[mainNavigator.pages[mainNavigator.pages.length - 1].data.index];
    });
});

module.controller('Guia', function ($scope, service) {

    ons.ready(function () {

        $scope.guia = [];
        $scope.category_id = mainNavigator.pages[mainNavigator.pages.length - 1].data ? mainNavigator.pages[mainNavigator.pages.length - 1].data.category_id : '';

        $scope.goToGuiaDetail = function (menu) {

            if (menu.subcategory == 0) {
                mainNavigator.pushPage('locals.html', {data: {category_id: menu.id}});
            } else {
                mainNavigator.pushPage('guia.html', {data: {category_id: menu.id}});
            }
        };

        $scope.getGuia = function () {

            modal.show();

            service.getGuia({category_id: $scope.category_id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();
                    $scope.guia = result.data;

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
            $scope.getGuia();
        }, 600);
    });
});

module.controller('Locals', function ($scope, service) {

    ons.ready(function () {

        $scope.locals = [];
        $scope.category_id = mainNavigator.pages[mainNavigator.pages.length - 1].data ? mainNavigator.pages[mainNavigator.pages.length - 1].data.category_id : '';

        $scope.redirectToLocalDetail = function (local) {

            $scope.goToLocal(local.local_id, local.type);
        };

        $scope.getLocals = function () {

            modal.show();

            service.getLocals({category_id: $scope.category_id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();
                    $scope.locals = result.data;

                    if (result.data.length == 0) {
                        alert(' ¡Ups! Todavía no tenemos ningún restaurante de esta categoría. ¡Prueba en otra!');
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
            $scope.getLocals();
        }, 600);
    });
});

function getUser() {

    //if (user == undefined) {

    if (localStorage.getItem(user_storage_key) != null && localStorage.getItem(user_storage_key) != undefined && localStorage.getItem(user_storage_key) != '' && localStorage.getItem(user_storage_key) != 'undefined') {

        user = JSON.parse(localStorage.getItem(user_storage_key));

    } else {

        user = false;
    }
    //}

    return user;
}

function saveUser(user) {

    localStorage.setItem(user_storage_key, JSON.stringify(user));

    user = JSON.parse(localStorage.getItem(user_storage_key));
}

function deleteUser() {

    localStorage.setItem(user_storage_key, undefined);
}

function alert(message, callback) {
    ons.notification.alert({
        message: message,
        // or messageHTML: '<div>Message in HTML</div>',
        title: t('menssage'),
        buttonLabel: 'OK',
        animation: 'default', // or 'none'
        // modifier: 'optional-modifier'
        callback: function () {
            callback ? callback() : '';
        }
    });
}

function confirm(message, callback) {
    ons.notification.confirm({
        message: message,
        // or messageHTML: '<div>Message in HTML</div>',
        title: ('Confirmación'),
        buttonLabels: [t('yes'), t('no')],
        animation: 'default', // or 'none'
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            // -1: Cancel
            // 0-: Button index from the left
            if (index == 0) {
                callback ? callback(index) : '';
            }
        }
    });
}

function shareByEmail(message, callback) {

    window.plugins.socialsharing.shareViaEmail(
        message, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
        '¿Cocinamos?',
        null, // TO: must be null or an array
        null, // CC: must be null or an array
        null, // BCC: must be null or an array
        [], // FILES: can be null, a string, or an array
        callback, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
        function (error) {
            alert(error)
        } // called when sh*t hits the fan
    );
}

function shareBySMS(message, callback) {
    window.plugins.socialsharing.shareViaSMS(message, null /* see the note below */, callback, function (msg) {
        alert('error: ' + msg)
    });
}

function shareByWhatsApp(message, callback) {
    window.plugins.socialsharing.shareViaWhatsApp(message, null /* img */, null /* url */, callback, function (errormsg) {
        alert(errormsg)
    });
}

function shareByFacebook(message, callback) {
    window.plugins.socialsharing.shareViaFacebook(message, null /* img */, null /* url */, callback, function (errormsg) {
        alert(errormsg)
    })
}

function shareBy(message, img) {
    window.plugins.socialsharing.share(
        message,
        'Compartir',
        [img],
        WEB_URL);
}
