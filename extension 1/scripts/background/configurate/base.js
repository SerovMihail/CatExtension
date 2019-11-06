(function(e) {
  "use strict";
  if (e.navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    e.chrome.runtime = e.browser.runtime;
    e.chrome.extension = e.browser.runtime;
    e.chrome.browserAction = e.browser.browserAction;
    e.chrome.tabs = e.browser.tabs;
    e.chrome.windows = e.browser.windows;
    e.chrome.storage = e.browser.storage;    
    e.chrome.i18n = e.browser.i18n;
    e.chrome = e.browser;
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
    function setter(key, value) {
      var o = settingStore[key];
      var fullKey = keyPrefix + key;
      if (typeof value == "object") {
        throw "object type not supported";
      } else if (o == value && localStorage[fullKey] != null) delete localStorage[fullKey]; else if (value == null) delete localStorage[fullKey]; else localStorage[fullKey] = value;
    }
    var userObj = {};
    var defineUser = function(key, setting) {
      if (setting == null) if (key == null) throw "name and defaultValue must have a concrete values"; else return userObj[key];
      if (typeof key != "string") throw "name is not of type string";
      settingStore[key] = setting;
      userObj.__defineGetter__(key, function() {
        return getter(key);
      });
      userObj.__defineSetter__(key, function(value) {
        setter(key, value);
      });
    };
    e.def = defineUser;
    e.user = userObj;
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
        throw "config is not mutable, if you need mutable key/val, use preferences mechanism";
      });
    };
    e.conf = defineConfig;
    e.config = configObj;
  })();
  e.storageDefaultKeys = [];
  e.storageDefault = function(key, value) {
    e.storageDefaultKeys.push(key);
    if (!localStorage.getItem(key)) localStorage.setItem(key, value);
  };
})(this);