(function (evnt) {
  var runtimeId = chrome.runtime.id;
  var extName = chrome.i18n.getMessage("extName");  
  var debugConsoleLog = function (t) {
    if (evnt.debug) console.log("ga: send event", t);
  };
  var r = function (message, object) {
    if (message != "opt-out" && message != "opted-out" && localStorage.getItem("optout") == "1") return;
    if (evnt.debug) console.log("TRACK: ", message, object); else {
      var eventObj = {
        hitType: "event",
        eventCategory: extName,
        eventAction: message
      };
      if (object) eventObj.eventLabel = object;
      debugConsoleLog(eventObj);
    }
  }; 
  var s, c;
  var n = function () {
    var date = new Date();
    var t = "" + date.getUTCFullYear();
    var a = date.getUTCMonth() < 9 ? "0" + (date.getUTCMonth() + 1) : "" + (date.getUTCMonth() + 1);
    var o = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : "" + date.getUTCDate();
    s = t + a + o;
    c = 0;
    var installDt = localStorage.getItem("installdt");
    if (!installDt) {
      localStorage.setItem("installdt", s);
    } else {
      try {
        var firstFourSymbols = installDt.substr(0, 4);
        var twoSlashFour = installDt.substr(4, 2) - 1;
        var twoSlashSix = installDt.substr(6, 2);
        var date = new Date(firstFourSymbols, twoSlashFour, twoSlashSix);
        var difference = evnt.getTime() - date.getTime();
        c = Math.floor(difference / (1e3 * 60 * 60 * 24));
      } catch (error) { }
    }
    localStorage.setItem("installdc", c);
    localStorage.setItem("BST", new Date().toISOString());
  };
  function getManifestVersion() {
    var manifest = chrome.runtime.getManifest();
    return manifest.version;
  }   
  var I = function (e, a) {
    r(e, a);
    var o = localStorage.getItem("confSE") || runtimeId;
    if (o.length === 32 && o.indexOf("://") === -1) o = "https://chrome.google.com/webstore/detail/" + getManifestVersion().replace(/\./g, "_") + "/" + o;
    if (e == "click-Rate") {
      var l = localStorage.getItem("confRE") || runtimeId;
      if (l.length === 32 && l.indexOf("://") === -1) l = "https://chrome.google.com/webstore/detail/" + l + "/reviews";
      chrome.tabs.create({
        url: l
      });
    } else if (e == "click-ShareFB") {
      chrome.tabs.create({
        url: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(o)
      });
    } else if (e == "click-ShareGG") {
      chrome.tabs.create({
        url: "https://plus.google.com/share?url=" + encodeURIComponent(o)
      });
    } else if (e == "click-ShareTW") {
      chrome.tabs.create({
        url: "http://www.twitter.com/share?url=" + encodeURIComponent(o)
      });
    } else if (e == "click-SharePI") {
      chrome.tabs.create({
        url: "https://pinterest.com/pin/create/bookmarklet/?url=" + encodeURIComponent(o)
      });
    } else if (e == "click-ShareTU") {
      chrome.tabs.create({
        url: "https://www.tumblr.com/widgets/share/tool?canonicalUrl=" + encodeURIComponent(o)
      });
    } else if (e == "click-ShareVK") {
      chrome.tabs.create({
        url: "http://vk.com/share.php?url=" + encodeURIComponent(o)
      });
    } else if (e == "click-Privacy") {
      chrome.tabs.create({
        url: "http://chromedhnewtab.com/privacy-policy/"
      });
    }
  };
  
  function _(t) {
    
    if (localStorage.getItem("installdt") === null) {
      localStorage.setItem("installdt", s);
    }
    handleClick();
    f = true;
    chrome.tabs.create({
      url: localStorage.getItem("newtab_url"),
      active: true
    });    
    setTimeout(function () {
      r("install-alive");
    }, 15e3);
  }  
  function w(t, a) {
    if (evnt.debug) console.log("Extension Active");
    if (localStorage.getItem("optout") === "1") {
      r("opted-out", a);
    } else {
      r("active", a);
    }
  }
  n();
  evnt.currVersion = evnt.currVersion || getManifestVersion();
  evnt.prevVersion = evnt.prevVersion || localStorage.getItem("version") || localStorage.getItem("installed");
  if (currVersion != prevVersion) {
    if (prevVersion === null) {
      _(currVersion);
    } else {
      localStorage.setItem("instact", 1);
      v(currVersion, prevVersion);
    }
    localStorage.setItem("version", currVersion);
  }
  var k = localStorage.getItem("last_active");
  evnt.last_active = false;
  if (!k || k !== s) {
    if (k) localStorage.setItem("instact", 1);
    w(currVersion, c);
    localStorage.setItem("last_active", s);
    evnt.last_active = true;
  }
  chrome.extension.onMessage.addListener(function (t, a, o) {
    if (typeof t == "string" && t.indexOf("click-") == 0) {
      I(t);
      return;
    } else if (typeof t.name == "string" && t.name.indexOf("click-") == 0) {
      I(t.name, t.data);
      return;
    } else if (t.search) {
      r(t.search, t.query);
      o("ok");
      return;
    } else if (t.trackNoti) {
      evnt.trackNoti(t.category, t.action);
    } else if (t.rateStatus) {
      if (c < 1) {
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