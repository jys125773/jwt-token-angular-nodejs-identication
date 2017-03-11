require.config({
    baseUrl: '/',
    paths: {
        'angular': 'static/js/angular.min',
        'angular-ui-router': 'static/js/angular-ui-router.min',
        'angular-async-loader': 'static/js/angular-async-loader.min',
        'app':'ngApp/app',
        'routes':'ngApp/routes',
        'httpInterceptor':'ngApp/services/httpInterceptor',
        'tokenParser':'ngApp/services/tokenParser',
        'angular-file-upload':'static/js/angular-file-upload.min',
        'ng-img-crop':'static/js/ng-img-crop',
        'ng-file-upload':'static/js/ng-file-upload.min'
    },
    shim: {
        'angular': {exports: 'angular'},
        'angular-ui-router': {deps: ['angular']},
        'angular-file-upload': {deps: ['angular']},
        'ng-img-crop':{deps: ['angular']},
        'ng-file-upload':{deps: ['angular']}
    }
});
require(['angular','routes'], function (angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        angular.element(document).find('html').addClass('ng-app');
    });
});