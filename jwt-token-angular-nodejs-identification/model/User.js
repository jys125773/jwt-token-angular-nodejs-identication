var mongoose = require('mongoose');
var crypto = require('crypto');
var userSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    hash: String,
    salt:String,
    createdOn: {
        type: Date,
        default: Date.now
    }
});
userSchema.statics.registOne = function(userJson,callback){
    userJson.salt = crypto.randomBytes(16).toString('hex');//哈希盐加密
    userJson.hash = crypto.pbkdf2Sync(userJson.password, userJson.salt,1000,64,'sha512').toString('hex');
    this.create(userJson,function(err,r){
        callback(err,r);
    });
};
userSchema.methods.matchPassword = function(user,password){
    var hash = crypto.pbkdf2Sync(password.toString(),user.salt,1000,64,'sha512').toString('hex');
    return hash == user.hash;
};
module.exports = mongoose.model('User', userSchema);