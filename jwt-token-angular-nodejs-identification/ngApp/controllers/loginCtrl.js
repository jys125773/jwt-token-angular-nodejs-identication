define(function (require) {
    var app = require('app');
    var tokenParser = require('tokenParser');

    app.controller('loginCtrl', ['$scope', '$rootScope', '$http','$window', '$state',function ($scope, $rootScope, $http,$window,$state) {
        $scope.user = $rootScope.user || null;
        $scope.login = function () {
            $http({
                url: 'user/login',
                method: 'post',
                data: $scope.user
            }).then(function (res) {
                var v = res.data.result;
                if (v==1){
                    $rootScope.auth = tokenParser(res.data.token);
                    $window.localStorage.setItem('token',res.data.token);
                    alert('登录成功!');
                    $state.go('app.dynamic');
                }else if(v == 0){
                    alert('密码错误!');
                }else if(v == -1){
                    alert('邮箱没注册!');
                }
            }, function (res) {
                alert('res.data');
            })
        };
    }]);
});