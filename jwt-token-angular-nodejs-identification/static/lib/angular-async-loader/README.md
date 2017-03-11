angular-loader
==============

Load angular modules and their dependencies asynchronously.

If the application is offline, the loader waits to be online
to start downloading. See ngCordova:$cordovaNetwork. If $cordovaNetwork
is available, it will use it to check online status. Otherwise
it uses navigator.onLine which does not work with all browser.
Firefox gets offline only if in offline mode, not if the connection is down.

Install
=======

Using bower:
```sh
bower install --save angular-async-loader
```

Include the script in your html after angular.js:
```html
<script src="bower_components/angular-async-loader/dist/angular-async-loader.js></script>
```

Then import the angular module.
```javascript
angular.module("app", ["angular-async-loader"])
```

Basic usage
===========

Load a script and get notified. This won't load any angular definitions
in you app unless you configure de module dependencies.
```javascript
.controller("myCtrl", function($ngLoad) {
  $ngLoad("http(s)://...").then(function() {
    // Do something.
  });
});
```

Configuration
=============

$ngLoadProvider.addModuleDep tells angular-loader to load the definitions
from these modules into the application when they are loaded. Similar to
angular.module("name", ["modulenames", ...]);

$ngLoadProvider.defineDep is for defining the dependencies in terms of url,
script to load, for an injectable.

```javascript
.config(function($ngLoadProvider) {
  $ngLoadProvider.addModuleDep(["modulenames", ...])
  .defineDep("service", ["scripturls", ...])
  .defineDep(...);
});
```

Usage
=====

Call $ngLoad with the component name you want to get. It returns a promise that is
resolved with the component when all it's dependencies are loaded. 

```javascript
.controller("myCtrl", function($ngLoad) {
  $ngLoad("service").then(function(service) {
    // Do something with service.
  });
});
```

If you want to group dependancies together, without an injectable component, prefix
the dependancy name with ':'. This prevent $ngLoad from injecting the name.
```javascript
.config(function($ngLoadProvider) {
  $ngLoadProvider.defineDep(":name", ["urls", ...]);
})
.controller("myCtrl", function($ngLoad) {
  $ngLoad(":name").then(function(name) {
    // Do something like show a div that uses a controller or directive that just
    // got loaded.
    // name has the value ":name".
  });
});
```

Load multiple components:
```javascript
.controller("myCtrl", function($ngLoad) {
  $ngLoad(["service", "otherComponent", ":name", ...]).then(function(dep) {
    // dep => {service : <service>, otherComponent : <otherComponent>, ":name" : ":name", ...}
    // i.e. You can user dep.service to use service.
  });
});
```
