var path = require('path');
var jwt = require('jsonwebtoken');
var formidable = require('formidable');
var fs = require('fs');
var User = require('../model/User.js');
exports.index = function(req,res){
    res.sendFile(path.join(__dirname,'../index.html'));
};
exports.regist = function(req,res){

    User.registOne(req.body,function(err,user){
        if(err){
            res.status(500).send(err.name);//服务器错误
        } else if(user){
            res.status(200).send(null);
        }else{
            res.status(403).send(null);//可能传入的数据格式不对被拒绝
        }
    });
};
exports.exist = function(req,res){
    User.findOne({email:req.query.email},function(err,user){
        if(err){
            res.status(500).send(err.name);//服务器错误
        }else if(user){
            res.json({result:1});
        }else{
            res.json({result:0});
        }
    })
};
exports.login = function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            return res.status(500).send(err.name);//服务器错误
        }
        if(user){
            if(user.matchPassword(user,req.body.password)){//密码匹配
                var token = jwt.sign(user,'jys', { expiresIn: 60 * 1 });//一分钟后token失效
                res.json({result:1,token:token});
            }else{
                res.json({result:0});
            }
        }else{
            res.json({result:-1});
        }
    })
};
exports.postImg = function(req,res){
    var form = new formidable.IncomingForm({keepExtensions:true});
    form.uploadDir = "static/uploads";
    form.parse(req, function (err, fields,files) {

        var email = fields.email;
        var suffix = files.file.name.replace(/.+\./,'');//后缀名
        fs.rename(files.file.path,'static/uploads/'+ email +'.'+suffix,function(err){
           if(err){
               res.status(500).send(err.name);//服务器错误
           }else{
               res.json({url:'static/uploads/'+ email +'.'+suffix});
           }
        });
    });
};
exports.show404 = function(req,res){
    res.status(404).send('404 not find');
};