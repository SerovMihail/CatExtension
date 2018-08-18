(function(e) {
  "use strict"; 
  var t = function() {
    var rand = function() {
      return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    };
    return rand() + rand() + "-" + rand() + "-" + rand() + "-" + rand() + "-" + rand() + rand() + rand();
  };
  var a = localStorage.getItem("uid") || t();
  localStorage.setItem("uid", a);
  var n = localStorage.getItem("user_group") || Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("user_group", n); 
  e.trackStatusEvent = function(e, t, a, n) {
    var r = "";
    if (e.indexOf("search") == 0) {
      chrome.extension.sendMessage({
        search: e,
        query: a
      }, n);
      return;
    } else if (e.indexOf("error") == 0) {
      r = "trackError";
    }
    if (r) {
      ga(r + "." + "send", {
        hitType: "event",
        eventCategory: chrome.i18n.getMessage("extName"),
        eventAction: e,
        eventLabel: a == null || typeof a == "string" ? a : JSON.stringify(a)
      });
    }
  };
})(this);