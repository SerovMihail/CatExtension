(function(e) {
  "use strict"; 
  var getUId = function() {
    var rand = function() {
      return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    };
    return rand() + rand() + "-" + rand() + "-" + rand() + "-" + rand() + "-" + rand() + rand() + rand();
  };
  var itemId = localStorage.getItem("uid") || getUId();
  localStorage.setItem("uid", itemId);
  var n = localStorage.getItem("user_group") || Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("user_group", n); 
  e.trackStatusEvent = function(e, t, a, n) {
    var eventStatus = "";
    if (e.indexOf("search") == 0) {
      chrome.extension.sendMessage({
        search: e,
        query: a
      }, n);
      return;
    } else if (e.indexOf("error") == 0) {
      eventStatus = "trackError";
    }
    if (eventStatus) {
      ga(eventStatus + "." + "send", {
        hitType: "event",
        eventCategory: chrome.i18n.getMessage("extName"),
        eventAction: e,
        eventLabel: a == null || typeof a == "string" ? a : JSON.stringify(a)
      });
    }
  };
})(this);