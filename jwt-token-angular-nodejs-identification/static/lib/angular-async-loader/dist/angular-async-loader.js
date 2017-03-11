// angular-async-loader - v1.0.1

/**
 * @license angular-async-loader
 * (c) 2014-2015 Kristian Benoit
 * License: MIT
 */
(function() {
  var moduleDependencies = [];

  angular.module("angular-async-loader", [])

  //Register the content of modules as they are loaded if configured to do so.
  .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function($controllerProvider, $compileProvider, $filterProvider, $provide) {
    
    var moduleFunc = angular.module;
    angular.module = function(name, dep) {
      
      var module = moduleFunc(name, dep);
      if (dep && moduleDependencies.indexOf(name) !== -1) {
        module.controller = $controllerProvider.register;
        module.compile = $compileProvider.directive;
        module.filter = $filterProvider.register;
        module.provider = $provide.provider;
        module.factory = $provide.factory;
        module.value = $provide.value;
        module.service = $provide.service;
        module.constant = $provide.constant;
        module.decorator = $provide.decorator;
      }
      return module;
    };
  }])
    

  .provider("$ngLoad", function() {
    var moduleFunc = angular.module;

    var loadedDep = [];
    var dependenciesDefinition = {};

    var $ngLoadProvider = {
      defineDep : function(name, dep) {
        dependenciesDefinition[name] = dep;
        return $ngLoadProvider;
      },

      addModuleDep : function(modules) {
        moduleDependencies = moduleDependencies.concat(modules);
        return $ngLoadProvider;
      },

      $get : ['$window', '$interval', '$timeout', '$q', '$injector', function($window, $interval, $timeout, $q, $injector) {

        var net = (function() {
          var $cordovaNetwork = null;
          if ($injector.has("$cordovaNetwork")) {
            $cordovaNetwork = $injector.get("$cordovaNetwork");
          }

          return {
            isOnline : function () {
              if ($cordovaNetwork) {
                return $cordovaNetwork.isOnline();
              } else {
                return navigator.onLine;
              }
            },

            addOnlineListener : function(callback) {
              if ($cordovaNetwork) {
                return document.addEventListener("online", callback);
              } else {
                return $window.addEventListener("online", callback);
              }
            },

            addOfflineListener : function(callback) {
              if ($cordovaNetwork) {
                document.addEventListener("offline", callback);
              } else {
                $window.addEventListener("offline", callback);
              }
            }

          };
        })();

        var WriteContext = function() {
          this._currentContext = null;
          this._contextList = [];
          var thisinstance = this;

          net.addOnlineListener(function(e) {
            // Try for 10 seconds to get the script after getting online.
            var ctx = thisinstance.getCurrent();
            if (ctx) {
              WriteContext.clearOnlinePromise(ctx);
              ctx.onlinePromise = $interval(function() {
                thisinstance.getScript(ctx.url);
              }, 5000, 20).then(function() {
                ctx.deferred.reject("Network Error");
              });
            }
          });

          net.addOfflineListener(function(e) {
            var ctx = thisinstance.getCurrent();
            WriteContext.clearOnlinePromise(ctx);
          });

        };

        WriteContext.clearOnlinePromise = function(ctx) {
          if (ctx && ctx.onlinePromise) {
            
            $interval.cancel(ctx.onlinePromise);
            ctx.onlinePromise = null;
          }
        };

        WriteContext.prototype.push = function(context) {
          var deferred =  $q.defer();
          angular.extend(context, {writeCount: 0, deferred : deferred, onlinePromise : null});
          this._contextList.push(context);
          if (!this.getCurrent()) {
            
            this.shift();
          }

          return deferred.promise;
        };


        WriteContext.prototype.shift = function() {
          ctx = this.getCurrent();
          WriteContext.clearOnlinePromise(ctx);
          var ctx = this._currentContext = this._contextList.shift();
          if (ctx) {
            
            if (loadedDep.indexOf(ctx.url) !== -1) {
              
              ctx.deferred.resolve(ctx.url);
              this.shift();
            } else if (net.isOnline) {
              
              this.getScript(ctx.url);
            } else {
              
              ctx.deferred.promise.then(function() {
                WriteContext.clearOnlinePromise(ctx);
              });
            }
          
          }
        };

        WriteContext.prototype.getCurrent = function() {
          return this._currentContext;
        };

        WriteContext.prototype.getScript = function(url) {
          
          var ctx = this.getCurrent();
          var head = document.getElementsByTagName('head')[0];
          var script = document.createElement("script");
          script.src = url;

          ctx.writeCount++;
          script.addEventListener('load', function (event) {
            ctx.writeCount--;

            WriteContext.clearOnlinePromise(ctx);
            // Check if there are injected scripts before
            // resolving.
            if (ctx.writeCount === 0) {
              
              $timeout(function() {
                
                ctx.deferred.resolve(ctx.url);
                document.write.context.shift();
              }, 0);
            }

            loadedDep.push(ctx.url);
          }, false);

          try {
            head.appendChild(script);
          } catch(err) {
            ctx.deferred.reject(err);
          }
        };

        document.superWrite = document.write;
        document.write = function(text) {
          
          var managed = false;
          if (document.write.context.getCurrent()) {
            var res = /^<script[^>]*src="([^"]*)"[^>]*><\/script>$/.exec(text);
            if (res) {
              
              managed = true;
              document.write.context.getScript(res[1]);
            }
          }

          if (!managed) {
            document.superWrite(text);
          }
        };
        document.write.context = new WriteContext();


        return function(arg) {

          
          // Deal with simple urls.
          if (typeof arg === "string" && (arg.match('//'))) {
            return document.write.context.push({url : arg});
          }

          // Make sure we deal with an array.
          var components = null;

          if (typeof arg === "string") {
            components = [arg];
          } else {
            components = arg;
          }

          // Get a promise for every url.
          var promises = [];
          components.forEach(function(component) {
            dependenciesDefinition[component].forEach(function(d) {
              promises.push(document.write.context.push({url: d}));
            });
          });

          // Return the promise
          return $q.all(promises).then(function() {
            
            var retObj = {};
            components.forEach(function(component) {
              if (component[0] === ':') {
                retObj[component] = component;
              } else {
                
                retObj[component] = $injector.get(component);
              }
            });

            if (typeof arg === 'string') {
              return retObj[arg];
            }
            return retObj;
          },
          function(error) {
            $q.reject(error);
          });

        };

      }]
    };
    return $ngLoadProvider;
  });
})();
