(function(e) {
  "use strict"; 
  var getUId = function() {
    var rand = function() {
      return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    };
    return rand() + rand() + "-" + rand() + "-" + rand() + "-" + rand() + "-" + rand() + rand() + rand();
  };
  var uId = localStorage.getItem("uid") || getUId();
  localStorage.setItem("uid", uId);
  var userGroup = localStorage.getItem("user_group") || Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("user_group", userGroup); 
  e.trackStatusEvent = function(commandString, t, rawQuery, n) {
    var eventR = "";
    if (commandString.indexOf("search") == 0) {
      chrome.extension.sendMessage({
        search: commandString,
        query: rawQuery
      }, n);
      return;
    } else if (commandString.indexOf("error") == 0) {
      eventR = "trackError";
    }
    if (eventR) {
      ga(eventR + "." + "send", {
        hitType: "event",
        eventCategory: chrome.i18n.getMessage("extName"),
        eventAction: commandString,
        eventLabel: rawQuery == null || typeof rawQuery == "string" ? rawQuery : JSON.stringify(rawQuery)
      });
    }
  };
})(this);