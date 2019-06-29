(function(e) {
  "use strict";
  var userGroup =
    localStorage.getItem("user_group") || Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("user_group", userGroup);
  localStorage.setItem(
    "newtab_url",
    chrome.extension.getURL("/main/index.html")
  );
  localStorage.setItem("ext_id", chrome.runtime.id);
  localStorage.setItem("ext_name", chrome.i18n.getMessage("extName"));
  chrome.browserAction.onClicked.addListener(function() {
    chrome.extension.sendMessage("click-BrowserAction");
    chrome.tabs.create({
      url: localStorage.getItem("newtab_url")
    });
  });

  user["date_format"] = "{{d}}.{{m}}.{{y}}";
  user["time_format"] = "24h";

  if (!user["sengine"]) {
    user["sengine"] = SEARCH_ENGINES_DEFAULT;
  }
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (e.debug) console.log("onMessage: ", message, sender);
    if (message.ext) {
      var n = JSON.parse(message.ext);
      for (var r in n) {
        localStorage[r] = n[r];
      }
      if (!n["sengine"]) {
        delete localStorage["sengine"];
      }
    } else if (message.getall) {
      sendResponse({
        ext: JSON.stringify(localStorage)
      });
    } else if (message.topSites) {
      chrome.topSites.get(function(e) {
        sendResponse(e);
      });
      return true;
    }

    if (message.type === "fetch_email_data") {
      d(u, f);
    }
    if (message.changeOptions) {
      var i = JSON.parse(localStorage.getItem("had_wl"));

      chrome.tabs.query({}, function(e) {
        for (var t = 0; t < e.length; t++) {
          if (e[t].id !== sender.tab.id) {
            chrome.tabs.sendMessage(e[t].id, {
              refreshOptions: true
            });
          }
        }
      });
    }
  });
  var g = function(e) {
    return btoa(
      encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function e(t, a) {
        return String.fromCharCode("0x" + a);
      })
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/\=/g, ".")
      .replace(/([a-zA-Z0-9._-]{10})/g, "$1~");
  };
  var m = function(e) {
    return decodeURIComponent(
      atob(
        e
          .replace(/\-/g, "+")
          .replace(/\_/g, "/")
          .replace(/\./g, "=")
          .replace(/\~/g, "")
      )
        .split("")
        .map(function(e) {
          return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  };
  var u = function(mailAddress, nums) {
    var a = {
      g: mailAddress
    };
    if (localStorage.getItem("dim1")) {
      try {
        a = JSON.parse(m(localStorage.getItem("dim1")));
        a.g = mailAddress;
      } catch (e) {}
    }
    localStorage.setItem("dim1", g(JSON.stringify(a)));
    chrome.tabs.query({}, function(a) {
      for (var o = 0; o < a.length; o++) {
        chrome.tabs.sendMessage(a[o].id, {
          type: "gmail_info_fetched",
          info: {
            mailAddress: mailAddress,
            mailNums: nums
          }
        });
      }
    });
  };
  var f = function(t) {
    if (t) {
      if (e.debug) console.log("background error: ", t);
    } else {
      if (e.debug) console.log("background An error occur!");
    }
  };
  var d = function(e, t) {
    var mailFeedUrl = "https://mail.google.com/mail/feed/atom";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
      if (xhr.responseXML) {
        var a = xhr.responseXML;
        var n = "";
        var r = a
          .getElementsByTagName("title")[0]
          .textContent.match(
            /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
          );
        if (r.length) n = r[0];
        var l = a.getElementsByTagName("fullcount")[0].textContent;
        if (n) {
          e(n, l);
        }
      } else {
        t();
      }
    };
    xhr.onerror = function(e) {
      t(e);
    };
    xhr.open("GET", mailFeedUrl, true, null, null);
    xhr.send(null);
  };
  setInterval(d.bind(e, u, f), 6e4);
  var v = null;
  function b() {
    chrome.windows.getAll(
      {
        populate: true
      },
      function(t) {
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
      }
    );
  }
  function w() {
    clearTimeout(v);
    v = setTimeout(b, 100);
  }
  chrome.tabs.onActivated.addListener(w);
  chrome.windows.onFocusChanged.addListener(w);
  chrome.runtime.onMessageExternal.addListener(function(
    message,
    sender,
    sendResponse
  ) {
    if (e.debug) console.log("exMsg:", message, sender);
    if (message.changeOptions) {
      for (var n = 0; n < e.storageDefaultKeys.length; n++) {
        var r = e.storageDefaultKeys[n];
        if (typeof message.changeOptions[r] !== "undefined")
          delete message.changeOptions[r];
      }
      if (message.changeOptions.enable_most_visited)
        localStorage.setItem(
          "enable_most_visited",
          message.changeOptions.enable_most_visited
        );
      else if (message.changeOptions.disable_most_visited)
        localStorage.setItem(
          "enable_most_visited",
          message.changeOptions.disable_most_visited == "yes" ? "no" : "yes"
        );
      if (message.changeOptions.enable_apps)
        localStorage.setItem("enable_apps", message.changeOptions.enable_apps);
      else if (message.changeOptions.disable_apps)
        localStorage.setItem(
          "enable_apps",
          message.changeOptions.disable_apps == "yes" ? "no" : "yes"
        );
      if (message.changeOptions.enable_share)
        localStorage.setItem(
          "enable_share",
          message.changeOptions.enable_share
        );
      else if (message.changeOptions.disable_share)
        localStorage.setItem(
          "enable_share",
          message.changeOptions.disable_share == "yes" ? "no" : "yes"
        );
      if (message.changeOptions.enable_autohide)
        localStorage.setItem(
          "enable_autohide",
          message.changeOptions.enable_autohide
        );
      if (message.changeOptions.enable_snow)
        localStorage.setItem("enable_snow", message.changeOptions.enable_snow);
      if (message.changeOptions.snow_type)
        localStorage.setItem("snow_type", message.changeOptions.snow_type);
      if (message.changeOptions.enable_countdown)
        localStorage.setItem(
          "enable_countdown",
          message.changeOptions.enable_countdown
        );
      if (message.changeOptions.countdownPosition)
        localStorage.setItem(
          "countdownPosition",
          message.changeOptions.countdownPosition
        );
      if (message.changeOptions.countdownText)
        localStorage.setItem(
          "countdownText",
          message.changeOptions.countdownText
        );
      if (message.changeOptions.countdownToTime)
        localStorage.setItem(
          "countdownToTime",
          message.changeOptions.countdownToTime
        );
      chrome.tabs.query({}, function(tabs) {
        for (var t = 0; t < tabs.length; t++) {
          chrome.tabs.sendMessage(tabs[t].id, {
            refreshOptions: true
          });
        }
      });
      if (typeof sendResponse === "function")
        sendResponse(chrome.runtime.id + " OK");
    }
  });
})(this);
