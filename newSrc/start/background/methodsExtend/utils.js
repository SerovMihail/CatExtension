(function (e) {
  "use strict";
  function t(e) {
    return localStorage[e];
  }
  function o(e, t) {
    localStorage[e] = t;
  }
  function n(e) {
    localStorage.clear();
  }
  var a = navigator.languages[0] || navigator.language;
  var l = a.substr(0, 2);
  var r = function () {
    var e = navigator.userAgent.toLowerCase();
    if (/x11; cros /.test(e)) {
      return "chromeOS";
    } else if (/macintosh; intel mac os x /.test(e)) {
      return "macOS";
    } else if (/x11; .*; linux /.test(e)) {
      return "linux";
    } else if (/windows nt 5.0/.test(e)) {
      return "winXP";
    } else if (/windows nt 6.0/.test(e)) {
      return "winVista";
    } else if (/windows nt 6.1/.test(e)) {
      return "win7";
    } else if (/windows nt 6.2/.test(e)) {
      return "win8";
    } else if (/windows nt 6.3/.test(e)) {
      return "win8.1";
    } else if (/windows nt 10.0/.test(e)) {
      return "win10";
    }
  }();
  var i = {
    get os() {
      return r;
    },
    get id() {
      var e = localStorage.getItem("ext_id") || chrome.app.getDetails().id;
      return e;
    },
    get id4() {
      var e = localStorage.getItem("ext_id") || chrome.app.getDetails().id;
      return e.substring(0, 4);
    },
    get version() {
      var e = localStorage.getItem("version") || chrome.app.getDetails().version;
      return e;
    },
    get locale() {
      return a;
    },
    get language() {
      return l;
    },
    get: function (e) {
      return t(e);
    },
    set: function (e, t) {
      o(e, t);
    },
    remove: function (e) {
      delete localStorage[e];
    },
    yymmdd: function () {
      try {
        var e = new Date();
        return (e.getUTCFullYear() + "").slice(-2) + ("0" + (e.getUTCMonth() + 1)).slice(-2) + ("0" + e.getUTCDate()).slice(-2) + ("0" + e.getUTCHours()).slice(-2);
      } catch (e) { }
    },
    count: function (e) {
      var t = this.get(e);
      if (t == null) t = 1; else t++;
      this.set(e, t);
    },
    mark_time: function (e) {
      this.set(e, new Date().getTime());
    },
    resetMouseEnterHnd: function (e, t) {
      e.off("mouseenter");
      e.on("mouseenter", t);
    },
    resetClickHnd: function (e, t) {
      e.off("click");
      e.on("click", t);
    },
    getGlobalOpt: function () {
      var t = {       
        disable_most_visited: localStorage.getItem("enable_most_visited") == "yes" ? "no" : "yes",
        disable_apps: localStorage.getItem("enable_apps") == "yes" ? "no" : "yes",
        disable_share: localStorage.getItem("enable_share") == "yes" ? "no" : "yes",        
        enable_most_visited: localStorage.getItem("enable_most_visited"),
        enable_apps: localStorage.getItem("enable_apps"),
        enable_share: localStorage.getItem("enable_share"),        
        enable_autohide: localStorage.getItem("enable_autohide"),
        enable_snow: localStorage.getItem("enable_snow"),
        snow_type: localStorage.getItem("snow_type"),
        enable_countdown: localStorage.getItem("enable_countdown"),
        countdownPosition: localStorage.getItem("countdownPosition"),
        countdownText: localStorage.getItem("countdownText"),
        countdownToTime: localStorage.getItem("countdownToTime")        
      };
      for (var o = 0; o < e.storageDefaultKeys.length; o++) {
        var n = e.storageDefaultKeys[o];
        if (typeof t[n] !== "undefined") delete t[n];
      }
      return t;
    },    
    getExtURL: function (e) {
      return chrome.extension.getURL(e);
    }  
  };
  e.utils = i;
  e.debug = localStorage.getItem("debug") === "debug";
  if (chrome.management && chrome.management.getSelf) {
    chrome.management.getSelf(function (t) {
      if (t.installType === "development") {
        e.debug = true;
        localStorage.setItem("debug", "debug");
      } else {
        e.debug = false;
        localStorage.removeItem("debug");
      }
    });
  }
})(this);