(function (e) {
  var id = chrome.runtime.id;
  var extName = chrome.i18n.getMessage("extName");  
  var debugFunc = function (t) {
    if (e.debug) console.log("ga: send event", t);
  };
  var call = function (req, object) {
    if (req != "opt-out" && req != "opted-out" && localStorage.getItem("optout") == "1") return;
    if (e.debug) console.log("TRACK: ", req, object); else {
      var eventObject = {
        hitType: "event",
        eventCategory: extName,
        eventAction: req
      };
      if (object) eventObject.eventLabel = object;
      debugFunc(eventObject);
    }
  }; 
  var fullDate, globalCounter;
  var getData = function () {
    var date = new Date();
    var utcYear = "" + date.getUTCFullYear();
    var utcMonth = date.getUTCMonth() < 9 ? "0" + (date.getUTCMonth() + 1) : "" + (date.getUTCMonth() + 1);
    var utcDate = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : "" + date.getUTCDate();
    fullDate = utcYear + utcMonth + utcDate;
    globalCounter = 0;
    var installDt = localStorage.getItem("installdt");
    if (!installDt) {
      localStorage.setItem("installdt", fullDate);
    } else {
      try {
        var r = installDt.substr(0, 4);
        var n = installDt.substr(4, 2) - 1;
        var i = installDt.substr(6, 2);
        var g = new Date(r, n, i);
        var m = e.getTime() - g.getTime();
        globalCounter = Math.floor(m / (1e3 * 60 * 60 * 24));
      } catch (e) { }
    }
    localStorage.setItem("installdc", globalCounter);
    localStorage.setItem("BST", new Date().toISOString());
  };
  function getManifestVersion() {    
    return chrome.runtime.getManifest().version;
  }   
  var I = function (stringCommand, argument) {
    call(stringCommand, argument);
    var checkKey = localStorage.getItem("confSE") || id;
    if (checkKey.length === 32 && checkKey.indexOf("://") === -1) checkKey = "https://chrome.google.com/webstore/detail/" + getManifestVersion().replace(/\./g, "_") + "/" + checkKey;
    if (stringCommand == "click-Rate") {
      var l = localStorage.getItem("confRE") || id;
      if (l.length === 32 && l.indexOf("://") === -1) l = "https://chrome.google.com/webstore/detail/" + l + "/reviews";
      chrome.tabs.create({
        url: l
      });
    } else if (stringCommand == "click-ShareFB") {
      chrome.tabs.create({
        url: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(checkKey)
      });
    } else if (stringCommand == "click-ShareGG") {
      chrome.tabs.create({
        url: "https://plus.google.com/share?url=" + encodeURIComponent(checkKey)
      });
    } else if (stringCommand == "click-ShareTW") {
      chrome.tabs.create({
        url: "http://www.twitter.com/share?url=" + encodeURIComponent(checkKey)
      });
    } else if (stringCommand == "click-SharePI") {
      chrome.tabs.create({
        url: "https://pinterest.com/pin/create/bookmarklet/?url=" + encodeURIComponent(checkKey)
      });
    } else if (stringCommand == "click-ShareTU") {
      chrome.tabs.create({
        url: "https://www.tumblr.com/widgets/share/tool?canonicalUrl=" + encodeURIComponent(checkKey)
      });
    } else if (stringCommand == "click-ShareVK") {
      chrome.tabs.create({
        url: "http://vk.com/share.php?url=" + encodeURIComponent(checkKey)
      });
    } else if (stringCommand == "click-Privacy") {
      chrome.tabs.create({
        url: "http://newtabwallpaperstheme.com/privacy-policy/"
      });
    }
  };
  
  function _(t) {
    
    if (localStorage.getItem("installdt") === null) {
      localStorage.setItem("installdt", fullDate);
    }
    handleClick();
    f = true;
    chrome.tabs.create({
      url: localStorage.getItem("newtab_url"),
      active: true
    });    
    setTimeout(function () {
      call("install-alive");
    }, 15e3);
  }  
  function w(t, a) {
    if (e.debug) console.log("Extension Active");
    if (localStorage.getItem("optout") === "1") {
      call("opted-out", a);
    } else {
      call("active", a);
    }
  }
  getData();
  e.currVersion = e.currVersion || getManifestVersion();
  e.prevVersion = e.prevVersion || localStorage.getItem("version") || localStorage.getItem("installed");
  if (currVersion != prevVersion) {
    if (prevVersion === null) {
      _(currVersion);
    } else {
      localStorage.setItem("instact", 1);
      //v(currVersion, prevVersion);
    }
    localStorage.setItem("version", currVersion);
  }
  var k = localStorage.getItem("last_active");
  e.last_active = false;
  if (!k || k !== fullDate) {
    if (k) localStorage.setItem("instact", 1);
    w(currVersion, globalCounter);
    localStorage.setItem("last_active", fullDate);
    e.last_active = true;
  }
  chrome.extension.onMessage.addListener(function (commandString, a, o) {
    if (typeof commandString == "string" && commandString.indexOf("click-") == 0) {
      I(commandString);
      return;
    } else if (typeof commandString.name == "string" && commandString.name.indexOf("click-") == 0) {
      I(commandString.name, commandString.data);
      return;
    } else if (commandString.search) {
      call(commandString.search, commandString.query);
      o("ok");
      return;
    } else if (commandString.trackNoti) {
      e.trackNoti(commandString.category, commandString.action);
    } else if (commandString.rateStatus) {
      if (globalCounter < 1) {
        o(0);
      } else if (localStorage.getItem("rate_clicked") == null) {
        o(1);
      } else if (localStorage.getItem("rate_clicked") == "yes" || localStorage.getItem("rate_clicked") == "feedback") {
        o(0);
      } else if (localStorage.getItem("rate_clicked") == "cws") {
        o(-1);
      }
    }
  });
  function handleClick() {
    
    if (!localStorage.getItem("enable_most_visited")) {
      if (!localStorage.getItem("disable_most_visited")) {
        localStorage.setItem("enable_most_visited", "yes");
      } else if (localStorage.getItem("disable_most_visited") == "yes") {
        localStorage.setItem("enable_most_visited", "no");
      } else {
        localStorage.setItem("enable_most_visited", "yes");
      }
      localStorage.removeItem("disable_most_visited");
    }
    if (!localStorage.getItem("enable_apps")) {
      if (!localStorage.getItem("disable_apps")) {
        localStorage.setItem("enable_apps", "yes");
      } else if (localStorage.getItem("disable_apps") == "yes") {
        localStorage.setItem("enable_apps", "no");
      } else {
        localStorage.setItem("enable_apps", "yes");
      }
      localStorage.removeItem("disable_apps");
    }
    if (!localStorage.getItem("enable_share")) {
      if (!localStorage.getItem("disable_share")) {
        localStorage.setItem("enable_share", "yes");
      } else if (localStorage.getItem("disable_share") == "yes") {
        localStorage.setItem("enable_share", "no");
      } else {
        localStorage.setItem("enable_share", "yes");
      }
      localStorage.removeItem("disable_share");
    }
   
    if (!localStorage.getItem("enable_slideshow")) {
      localStorage.setItem("enable_slideshow", "no");
    }    
    if (!localStorage.getItem("enable_autohide")) {
      localStorage.setItem("enable_autohide", "no");
    }
    if (!localStorage.getItem("enable_snow")) {
      localStorage.setItem("enable_snow", "no");
    }
    if (!localStorage.getItem("snow_type")) {
      localStorage.setItem("snow_type", "flake");
    }
    if (!localStorage.getItem("enable_countdown")) {
      if (typeof user["countdownText"] !== "undefined" && typeof user["countdownToTime"] !== "undefined") {
        localStorage.setItem("enable_countdown", "yes");
        localStorage.setItem("countdownToTime", user["countdownToTime"]);
        localStorage.setItem("countdownText", user["countdownText"]);
      } else {
        localStorage.setItem("enable_countdown", "no");
        var e = new Date().getUTCFullYear() + 1 + "-01-01T00:00:00";
        localStorage.setItem("countdownToTime", e);
        localStorage.setItem("countdownText", "New Year");
      }
      if (!localStorage.getItem("countdownPosition")) {
        localStorage.setItem("countdownPosition", "Bottom Center");
      }
    }
    if (!localStorage.getItem("last_opened")) {
      localStorage.setItem("last_opened", new Date().getTime());
    }
    
    if (!localStorage.getItem("shuffle_background") || !localStorage.getItem("shuffle_favorites")) {
      localStorage.setItem("shuffle_background", "yes");
      localStorage.setItem("shuffle_favorites", "no");
    }
    if (!localStorage.getItem("mark_favor")) {
      localStorage.setItem("mark_favor", JSON.stringify([]));
    }    
  }
})(this);