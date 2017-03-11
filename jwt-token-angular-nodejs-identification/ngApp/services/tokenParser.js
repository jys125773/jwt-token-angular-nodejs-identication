define(function (require, exports, module) {
    var url_base64_decode = function(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    };
    var tokenParser = function(token){
        var encodedProfile = token.split('.')[1];
        var profile = JSON.parse(url_base64_decode(encodedProfile));
        return profile._doc;
    };
    module.exports = tokenParser;
});