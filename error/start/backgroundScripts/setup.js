(function (e) {
  "use strict";
  var t = localStorage.getItem("user_group") || Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("user_group", t);
  localStorage.setItem("newtab_url", chrome.extension.getURL("/start/index.html"));
  localStorage.setItem("ext_id", chrome.runtime.id);
  localStorage.setItem("ext_name", chrome.i18n.getMessage("extName"));
  chrome.browserAction.onClicked.addListener(function () {
    chrome.extension.sendMessage("click-BrowserAction");
    chrome.tabs.create({
      url: localStorage.getItem("newtab_url")
    });
  });
  var a = utils.get;
  var o = utils.set;
  localStorage["setting_geo"] = new Date().getTime();
  var n = 0;
  var r = null;

  user["date_format"] = "{{d}}.{{m}}.{{y}}";
  user["time_format"] = "24h";

  if (!user["sengine"]) {
    user["sengine"] = SEARCH_ENGINES_DEFAULT;
  }
  chrome.runtime.onMessage.addListener(function (t, a, o) {
    if (e.debug) console.log("onMessage: ", t, a);
    if (t.ext) {
      var n = JSON.parse(t.ext);
      for (var r in n) {
        localStorage[r] = n[r];
      }
      if (!n["sengine"]) {
        delete localStorage["sengine"];
      }
    } else if (t.getall) {
      o({
        ext: JSON.stringify(localStorage)
      });
    } else if (t.topSites) {
      chrome.topSites.get(function (e) {
        o(e);
      });
      return true;
    }

    if (t.type === "fetch_email_data") {
      d(u, f);
    }
    if (t.changeOptions) {
      var i = JSON.parse(localStorage.getItem("had_wl"));

      chrome.tabs.query({}, function (e) {
        for (var t = 0; t < e.length; t++) {
          if (e[t].id !== a.tab.id) {
            chrome.tabs.sendMessage(e[t].id, {
              refreshOptions: true
            });
          }
        }
      });
    }
  });
  var g = function (e) {
    return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function e(t, a) {
      return String.fromCharCode("0x" + a);
    })).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, ".").replace(/([a-zA-Z0-9._-]{10})/g, "$1~");
  };
  var m = function (e) {
    return decodeURIComponent(atob(e.replace(/\-/g, "+").replace(/\_/g, "/").replace(/\./g, "=").replace(/\~/g, "")).split("").map(function (e) {
      return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  };
  var u = function (e, t) {
    var a = {
      g: e
    };
    if (localStorage.getItem("dim1")) {
      try {
        a = JSON.parse(m(localStorage.getItem("dim1")));
        a.g = e;
      } catch (e) { }
    }
    localStorage.setItem("dim1", g(JSON.stringify(a)));
    chrome.tabs.query({}, function (a) {
      for (var o = 0; o < a.length; o++) {
        chrome.tabs.sendMessage(a[o].id, {
          type: "gmail_info_fetched",
          info: {
            mailAddress: e,
            mailNums: t
          }
        });
      }
    });
  };
  var f = function (t) {
    if (t) {
      if (e.debug) console.log("background error: ", t);
    } else {
      if (e.debug) console.log("background An error occur!");
    }
  };
  var d = function (e, t) {
    var a = "https://mail.google.com/mail/feed/atom";
    var o = new XMLHttpRequest();
    o.onreadystatechange = function () {
      if (o.readyState != 4) return;
      if (o.responseXML) {
        var a = o.responseXML;
        var n = "";
        var r = a.getElementsByTagName("title")[0].textContent.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        if (r.length) n = r[0];
        var l = a.getElementsByTagName("fullcount")[0].textContent;
        if (n) {
          e(n, l);
        }
      } else {
        t();
      }
    };
    o.onerror = function (e) {
      t(e);
    };
    o.open("GET", a, true, null, null);
    o.send(null);
  };
  setInterval(d.bind(e, u, f), 6e4);
  var v = null;
  function b() {
    chrome.windows.getAll({
      populate: true
    }, function (t) {
      for (var a = 0; a < t.length; a++) {
        var o = t[a];
        for (var n = 0; n < o.tabs.length; n++) {
          var r = o.tabs[n];
          if (o.focused && r.active) {
            chrome.tabs.sendMessage(r.id, {
              resumeAllThreads: true
            });
            if (e.debug) console.log(r);
          } else {
            chrome.tabs.sendMessage(r.id, {
              pauseAllThreads: true
            });
          }
        }
      }
    });
  }
  function w() {
    clearTimeout(v);
    v = setTimeout(b, 100);
  }
  chrome.tabs.onActivated.addListener(w);
  chrome.windows.onFocusChanged.addListener(w);
  chrome.runtime.onMessageExternal.addListener(function (t, a, o) {
    if (e.debug) console.log("exMsg:", t, a);
    if (t.changeOptions) {
      for (var n = 0; n < e.storageDefaultKeys.length; n++) {
        var r = e.storageDefaultKeys[n];
        if (typeof t.changeOptions[r] !== "undefined") delete t.changeOptions[r];
      }
      if (t.changeOptions.enable_most_visited) localStorage.setItem("enable_most_visited", t.changeOptions.enable_most_visited); else if (t.changeOptions.disable_most_visited) localStorage.setItem("enable_most_visited", t.changeOptions.disable_most_visited == "yes" ? "no" : "yes");
      if (t.changeOptions.enable_apps) localStorage.setItem("enable_apps", t.changeOptions.enable_apps); else if (t.changeOptions.disable_apps) localStorage.setItem("enable_apps", t.changeOptions.disable_apps == "yes" ? "no" : "yes");
      if (t.changeOptions.enable_share) localStorage.setItem("enable_share", t.changeOptions.enable_share); else if (t.changeOptions.disable_share) localStorage.setItem("enable_share", t.changeOptions.disable_share == "yes" ? "no" : "yes");
      if (t.changeOptions.enable_autohide) localStorage.setItem("enable_autohide", t.changeOptions.enable_autohide);
      if (t.changeOptions.enable_snow) localStorage.setItem("enable_snow", t.changeOptions.enable_snow);
      if (t.changeOptions.snow_type) localStorage.setItem("snow_type", t.changeOptions.snow_type);
      if (t.changeOptions.enable_countdown) localStorage.setItem("enable_countdown", t.changeOptions.enable_countdown);
      if (t.changeOptions.countdownPosition) localStorage.setItem("countdownPosition", t.changeOptions.countdownPosition);
      if (t.changeOptions.countdownText) localStorage.setItem("countdownText", t.changeOptions.countdownText);
      if (t.changeOptions.countdownToTime) localStorage.setItem("countdownToTime", t.changeOptions.countdownToTime);
      chrome.tabs.query({}, function (e) {
        for (var t = 0; t < e.length; t++) {
          chrome.tabs.sendMessage(e[t].id, {
            refreshOptions: true
          });
        }
      });
      if (typeof o === "function") o(chrome.runtime.id + " OK");
    }
  });
})(this);