define(function(require){
    var app = require('app');
    app.controller('headerCtrl',['$scope','$window','$state','$rootScope',function($scope,$window,$state,$rootScope){
        $scope.logout = function(){
            $window.localStorage.removeItem('token');
            $rootScope.user = $rootScope.auth;
            $rootScope.auth = null;
            $state.go('app.login');
        };
    }]);
});