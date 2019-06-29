(function(arg) {
  "use strict";
  if (arg.navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    arg.chrome.runtime = arg.browser.runtime;
    arg.chrome.extension = arg.browser.runtime;
    arg.chrome.browserAction = arg.browser.browserAction;
    arg.chrome.tabs = arg.browser.tabs;
    arg.chrome.windows = arg.browser.windows;
    arg.chrome.storage = arg.browser.storage;    
    arg.chrome.i18n = arg.browser.i18n;
    arg.chrome = arg.browser;
  }
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
      value: function(event) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
        var array = Object(this);
        var plusOneBinary = array.length >>> 0;
        if (typeof event !== "function") {
          throw new TypeError("predicate must be a function");
        }
        var fistArg = arguments[1];
        var zero = 0;
        while (zero < plusOneBinary) {
          var i = array[zero];
          if (event.call(fistArg, i, zero, array)) {
            return i;
          }
          zero++;
        }
        return undefined;
      }
    });
  }
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(e) {
      var secondArg, counter;
      if (this == null) {
        throw new TypeError("this is null or not defined");
      }
      var n = Object(this);
      var o = n.length >>> 0;
      if (typeof e !== "function") {
        throw new TypeError(e + " is not a function");
      }
      if (arguments.length > 1) {
        secondArg = arguments[1];
      }
      counter = 0;
      while (counter < o) {
        var increment;
        if (counter in n) {
          increment = n[counter];
          e.call(secondArg, increment, counter, n);
        }
        counter++;
      }
    };
  }
  (function() {
    var keyPrefix = "";
    var settingStore = {};
    function getter(key) {
      var localStorageCell = localStorage[keyPrefix + key];
      if (localStorageCell == null) {
        localStorageCell = settingStore[key];
        return localStorageCell;
      }
      if (typeof localStorageCell == "string") {
        if (localStorageCell == "false") return false; else if (localStorageCell == "true") return true; else if (typeof parseInt(localStorageCell) != "number" && localStorageCell != "NaN") return localStorageCell; else if (parseInt(localStorageCell) == localStorageCell) return parseInt(localStorageCell); else return "" + localStorageCell;
      }
      return localStorageCell;
    }
    function setter(e, n) {
      var o = settingStore[e];
      var i = keyPrefix + e;
      if (typeof n == "object") {
        throw "object type not supported";
      } else if (o == n && localStorage[i] != null) delete localStorage[i]; else if (n == null) delete localStorage[i]; else localStorage[i] = n;
    }
    var userObj = {};
    var defineUser = function(e, r) {
      if (r == null) if (e == null) throw "name and defaultValue must have a concrete values"; else return userObj[e];
      if (typeof e != "string") throw "name is not of type string";
      settingStore[e] = r;
      userObj.__defineGetter__(e, function() {
        return getter(e);
      });
      userObj.__defineSetter__(e, function(r) {
        setter(e, r);
      });
    };
    arg.def = defineUser;
    arg.user = userObj;
  })();
  (function() {
    var r = {};
    var configObj = {};
    var defineConfig = function(e, n) {
      r[e] = n;
      t.__defineGetter__(e, function() {
        return r[e];
      });
      t.__defineSetter__(e, function(e) {
        throw "config is not mutable, if you need mutable key/val, use preferences machanism";
      });
    };
    arg.conf = defineConfig;
    arg.config = configObj;
  })();
  arg.storageDefaultKeys = [];
  arg.storageDefault = function(r, t) {
    arg.storageDefaultKeys.push(r);
    if (!localStorage.getItem(r)) localStorage.setItem(r, t);
  };
})(this);