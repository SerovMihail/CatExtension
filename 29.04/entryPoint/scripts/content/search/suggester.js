window.AutoSuggest = function(textBox, engine, action) {
  "use strict";
  var that = this;
  var interval = null;
  var lastValue = "";
  var m_suggestUrl = engine;
  that.asDiv = null;
  var selectedRow = -1;
  var resultsLength = 0;
  that.action = action;
  that.init = function() {
    textBox.addEventListener("keydown", that.keyDown, false);
    textBox.addEventListener("keyup", that.keyUp, false);
  };
  that.setSuggestUrl = function(url) {
    m_suggestUrl = url;
  };
  that.sprintf = function(str, params) {
    var formatted = str;
    for (var k in params) {
      var v = params[k];
      var regexp = new RegExp("\\{" + k + "\\}", "gi");
      formatted = formatted.replace(regexp, v);
    }
    return formatted;
  };
  that.getData = function(val) {
    if (!val) {
      if (that.asDiv != null) that.asDiv.style.display = "none";
      return;
    }
    // no data retrieves if, suggest url is empty
    if (m_suggestUrl === undefined || m_suggestUrl === "") {
      return;
    }
    var locale = utils.locale;
    var locale = locale.replace("_", "-");

    var URL = that.sprintf(m_suggestUrl, {
      searchTerms: val,
      lang: locale,
      country: ""
    });

    {
      var xmlHttpRequest;
      xmlHttpRequest = new XMLHttpRequest();
      xmlHttpRequest.open("GET", URL, true);
      xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState == 4) {
          if (xmlHttpRequest.status == 200) {
            var response;
            if (lastValue == val) {
              if (that.asDiv == null) {
                that.asDiv = document.getElementById("search-suggestion-pad");
              }
              // clean previous result
              that.asDiv.innerHTML = null;

              var response = xmlHttpRequest.response;

              if (
                typeof SEARCH_ENGINES[user["sengine"]]["SuggestParser"] ==
                "function"
              ) {
                response = SEARCH_ENGINES[user["sengine"]]["SuggestParser"](
                  response
                );
              } else {
                response = JSON.parse(response);
              }

              var completeSuggestion = response[1];
              resultsLength = completeSuggestion.length;
              for (var i = 0; i < resultsLength && i < 5; i++) {
                var resultVal = completeSuggestion[i];
                var row = document.createElement("li");

                var pos = resultVal.indexOf(val);
                if (pos != -1) {
                  row.innerHTML =
                    resultVal.substr(0, pos + val.length) +
                    "<b>" +
                    resultVal.substr(pos + val.length) +
                    "</b>";
                } else {
                  row.textContent = resultVal;
                }

                row.setAttribute("id", "auto-suggest-row" + i);
                row.index = i;
                row.isRow = true;
                row.addEventListener(
                  "mouseover",
                  function(e) {
                    var row = e.currentTarget;
                    if (selectedRow != -1)
                      document
                        .getElementById("auto-suggest-row" + selectedRow)
                        .setAttribute("class", "");
                    row.setAttribute("class", "selected");
                    selectedRow = row.index;
                  },
                  false
                );
                row.addEventListener(
                  "click",
                  function(e) {
                    var row = e.currentTarget;
                    textBox.value = row.textContent;
                    that.onSearch(row.textContent);
                    e.preventDefault();
                  },
                  false
                );

                that.asDiv.appendChild(row);
              }
              selectedRow = -1;
              if (resultsLength == 0) {
                that.asDiv.style.display = "none";
              } else {
                that.asDiv.style.display = "block";
              }
            }
          }
        }
      };
      xmlHttpRequest.send("");
    }
    //)
  };
  that.keyUp = function(e) {
    var keyCode = e.keyCode;
    if (keyCode != getKeyCode("ENTER")) {
      if (
        keyCode != getKeyCode("UP_ARROW") &&
        keyCode != getKeyCode("DOWN_ARROW") &&
        keyCode != getKeyCode("F5")
      ) {
        if (interval != null) {
          window.clearInterval(interval);
          interval = null;
        }
        lastValue = textBox.value;
        interval = setTimeout(that.getData, 10, textBox.value);
      }
    }
  };
  that.keyDown = function(e) {
    var keyCode = e.keyCode;    
  };
  that.documentMouseDown = function(e) {
    if (e.explicitOriginalTarget != that.asDiv) {
      lastValue = "--";
      if (that.asDiv != null) {
        that.asDiv.style.display = "none";
        try {
          document.getElementById("container").style.height = "3px";
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  that.setASdivPosition = function() {
    var el = textBox;
    var offsetX = 0;
    var offsetY = textBox.offsetHeight - 1;
    while (el.offsetParent && el.tagName.toLowerCase() != "body") {
      offsetX += el.offsetLeft;
      offsetY += el.offsetTop;
      el = el.offsetParent;
    }
    offsetX += el.offsetLeft;
    offsetY += el.offsetTop;
    if (that.asDiv != null) {
      that.asDiv.style.left = offsetX + "px";
      that.asDiv.style.top = offsetY + "px";
    }
  };

  that.onSearch = function(val) {
    lastValue = "--";
    if (that.asDiv != null) {
      that.asDiv.style.display = "none";
      if (document.getElementById("container")) {
        document.getElementById("container").style.height = "29px";
      }
      that.action();
    }
  };

  that.changeSuggestUrl = function(aUrl) {
    m_suggestUrl = aUrl;
  };

  that.init();
};
