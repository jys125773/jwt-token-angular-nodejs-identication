define(function (require) {
    var app = require('app');
    require('httpInterceptor');
    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/');
        $httpProvider.interceptors.push('httpInterceptor');

        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    '': {
                        template: "<div ui-view='header'></div>" + "<div ui-view='content'></div>" + "<div ui-view='footer'></div>"
                    },
                    'header@app': {
                        templateUrl: '/ngApp/views/header.html',
                        controllerUrl: '/ngApp/controllers/headerCtrl.js',
                        controller: 'headerCtrl'
                    },
                    'footer@app': {
                        templateUrl: '/ngApp/views/footer.html'
                    }
                }
            })
            .state('app.dynamic', {//说说动态
                url: 'dynamic',
                views: {
                    'content@app': {
                        template: "<div class='jumbotron'><h1 class='text-center'>最新动态</h1></div>"
                    }
                }
            })
            .state('app.login', {
                url: 'login',
                views: {
                    'content@app': {
                        templateUrl: '/ngApp/views/login.html',
                        controllerUrl: '/ngApp/controllers/loginCtrl.js',
                        controller: 'loginCtrl'
                    }
                }
            })
            .state('app.regist', {
                url: 'regist',
                views: {
                    'content@app': {
                        templateUrl: '/ngApp/views/regist.html',
                        controllerUrl: '/ngApp/controllers/registCtrl.js',
                        controller: 'registCtrl'
                    }
                }
            })
            .state('app.profile', {
                url: 'profile',
                views: {
                    'content@app': {
                        templateUrl: '/ngApp/views/profile.html',
                        controllerUrl: '/ngApp/controllers/profileCtrl.js',
                        controller: 'profileCtrl'
                    }
                }
            })
            .state('app.crop', {
                url: 'crop',
                views: {
                    'content@app': {
                        templateUrl: '/ngApp/views/crop.html',
                        controllerUrl: '/ngApp/controllers/cropCtrl.js',
                        controller: 'cropCtrl'
                    }
                }
            })
    }]);
});