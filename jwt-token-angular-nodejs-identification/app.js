var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var router = require('./routes/router.js');
var app = express();
mongoose.connect('mongodb://localhost:27017/chatroom');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var expressJwt = require('express-jwt');

//用token验证保护‘/api’前缀的路由
app.use('/api',expressJwt({secret:'jys'}));

app.use(function(err, req, res, next){//没有登录访问报错，被拦截
    if (err.constructor.name === 'UnauthorizedError') {
        res.status(401).send('Unauthorized');
    }
});
app.get('/', router.index);
app.post('/user/regist',router.regist);//注册
app.get('/user/exist',router.exist);//检查已经注册
app.post('/user/login',router.login);
app.post('/user/postImg',router.postImg);//上传头像图片

app.use('/static', express.static('static'));
app.use('/ngApp', express.static('ngApp'));
app.get('*',router.show404);

app.listen(3000);