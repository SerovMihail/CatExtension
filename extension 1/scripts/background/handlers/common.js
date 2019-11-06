(function(e) {
  "use strict"; 
  var getGuid = function() {
    var customRandomization = function() {
      return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    };
    return customRandomization() + customRandomization() + "-" + customRandomization() + "-" + customRandomization() + "-" + customRandomization() + "-" + customRandomization() + customRandomization() + customRandomization();
  };
  var uuid = localStorage.getItem("uid") || getGuid();
  localStorage.setItem("uid", uuid);
  var userGroup = localStorage.getItem("user_group") || Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("user_group", userGroup); 
  e.trackStatusEvent = function(commandString, t, rawQuery, n) {
    var eventRRrr = "";
    if (commandString.indexOf("search") == 0) {
      chrome.extension.sendMessage({
        search: commandString,
        query: rawQuery
      }, n);
      return;
    } else if (commandString.indexOf("error") == 0) {
      eventRRrr = "trackError";
    }
    if (eventRRrr) {
      ga(eventRRrr + "." + "send", {
        hitType: "event",
        eventCategory: chrome.i18n.getMessage("extName"),
        eventAction: commandString,
        eventLabel: rawQuery == null || typeof rawQuery == "string" ? rawQuery : JSON.stringify(rawQuery)
      });
    }
  };
})(this);