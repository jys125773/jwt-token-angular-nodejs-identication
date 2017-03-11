define(function (require) {
    var app = require('app');
    app.controller('profileCtrl', ['$scope', '$rootScope', 'FileUploader','$timeout', function ($scope, $rootScope, FileUploader,$timeout) {
        $scope.auth = $rootScope.auth;


        $scope.uploadStatus = false;

        $scope.broadcastName = '';

        var uploader = $scope.uploader = new FileUploader({
            url: 'user/postImg',
            queueLimit: 1,     //文件个数
            formData:[{email:$scope.auth.email}],
            removeAfterUpload: true   //上传后删除文件

        });

        $scope.clearItems = function () {    //重新选择文件时，清空队列，达到覆盖文件的效果
            uploader.clearQueue();
        };

        uploader.onAfterAddingFile = function (fileItem) {
            $scope.fileItem = fileItem._file;    //添加文件之后，把文件信息赋给scope

            var fileReader = new FileReader();
            fileReader.readAsDataURL(fileItem._file);

        };

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.uploadStatus = true;   //上传成功则把状态改为true
            uploader.clearQueue();
            alert('图片上传成功！');
            $scope.image = response.url;
        };

        $scope.UploadFile = function () {
            uploader.uploadAll();
        }
    }]);
})