define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');

    require('angular-ui-router');
    require('angular-file-upload');
    require('ng-img-crop');
    require('ng-file-upload');

    var tokenParser = require('tokenParser');

    var app = angular.module('app', ['ui.router','angularFileUpload','ngImgCrop','ngFileUpload']).run(function ($rootScope) {
        if(window.localStorage.token){
            $rootScope.auth = tokenParser(window.localStorage.token);
            $rootScope.user = $rootScope.auth;
        }else{
            $rootScope.auth = null;
            $rootScope.user = null;
        }
    });

    asyncLoader.configure(app);
    module.exports = app;
});