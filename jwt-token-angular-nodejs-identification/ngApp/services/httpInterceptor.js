define(function (require) {
    var app = require('app');
    app.factory('httpInterceptor', function ($rootScope, $q, $window) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                }
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    console.log('未授权');
                }
                return $q.reject(rejection);
            }
        };
    });
});