(function(e) {
  if (e.injectedContentHomepage || e.self !== e.top) return;
  e.injectedContentHomepage = true;
  var t = function(e) {
    if (document.readyState === "complete") {
      e();
    } else {
      document.addEventListener("DOMContentLoaded", e);
    }
  };
  var n = function() {
    if (document.getElementsByClassName("click-Rate").length) {
      var e = document.getElementsByClassName("click-Rate");
      for (var t = 0; t < e.length; t++) {
        e[t].addEventListener("click", function() {
          chrome.extension.sendMessage("click-Rate");
        });
      }
    }    
    if (document.getElementsByClassName("click-ShareFB").length) {
      var e = document.getElementsByClassName("click-ShareFB");
      for (var t = 0; t < e.length; t++) {
        e[t].addEventListener("click", function() {
          chrome.extension.sendMessage("click-ShareFB");
        });
      }
    }
    if (document.getElementsByClassName("click-ShareGG").length) {
      var e = document.getElementsByClassName("click-ShareGG");
      for (var t = 0; t < e.length; t++) {
        e[t].addEventListener("click", function() {
          chrome.extension.sendMessage("click-ShareGG");
        });
      }
    }
    if (document.getElementsByClassName("click-ShareTW").length) {
      var e = document.getElementsByClassName("click-ShareTW");
      for (var t = 0; t < e.length; t++) {
        e[t].addEventListener("click", function() {
          chrome.extension.sendMessage("click-ShareTW");
        });
      }
    }    
  };
  
})(this);