define(function (require) {
    var app = require('app');
    app.controller('cropCtrl', ['$rootScope','$scope', 'Upload', '$timeout', function ($rootScope,$scope, Upload, $timeout) {
        $scope.upload = function (dataUrl, name) {
            Upload.upload({
                url: '/user/postImg',
                data: {
                    file: Upload.dataUrltoBlob(dataUrl, name),
                    email:$rootScope.auth.email
                },
            }).then(function (response) {
                $timeout(function () {
                    $scope.result = response.data;
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
    }]);
});