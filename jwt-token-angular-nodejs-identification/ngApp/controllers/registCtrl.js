define(function (require) {
    var app = require('app');
    app.controller('registCtrl', ['$rootScope','$scope', '$http','$state',function ($rootScope,$scope, $http,$state) {
        $scope.user = {email: '', password: ''};
        $scope.isEmailRegisted = false;

        $scope.reset = function (form) {
            $scope.user = {email: '', password: ''};
            $scope.password1 = '';
            form.$setPristine();
        };
        $scope.validateRegisted = function () {//检查邮箱是否已经被注册
            $http.get('/user/exist?email=' + $scope.user.email).then(function (res) {
                var v = res.data.result;
                if (v == 1) {
                    $scope.isEmailRegisted = true;
                } else if (v == 0) {
                    $scope.isEmailRegisted = false;
                }
            }, function (res) {
                alert(res.data);
            });
        };
        $scope.regist = function () {
            $http({
                url: '/user/regist',
                method: 'post',
                data: $scope.user
            }).then(function () {
                alert('注册成功，现在前往登录界面。');
                $state.go('app.login');
                $rootScope.user = $scope.user;
            }, function (res) {
                alert(res.data);
            });
        };
    }]);
});