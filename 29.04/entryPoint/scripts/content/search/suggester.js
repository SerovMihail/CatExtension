window.AutoSuggest = function (textBox, engine, action) {
  "use strict";
  var self = this;
  var interval = null;
  var lastValue = "";
  var m_suggestUrl = engine;
  self.asDiv = null;
  var selectedRow = -1;
  var resultsLength = 0;
  self.action = action;
  self.init = function () {
    textBox.addEventListener("keydown", self.keyDown, false);
    textBox.addEventListener("keyup", self.keyUp, false);
  }
  self.setSuggestUrl = function (su) {
    m_suggestUrl = su;
  }
  self.sprintf = function (str, params) {
    var formatted = str;
    for (var k in params) {
      var v = params[k];
      var regexp = new RegExp('\\{' + (k) + '\\}', 'gi');
      formatted = formatted.replace(regexp, v);
    }
    return formatted;
  }
  self.getData = function (val) {
    if (!val) {
      if (self.asDiv != null) self.asDiv.style.display = 'none';
      return;
    }
    // no data retrieves if, suggest url is empty 
    if (m_suggestUrl === undefined || m_suggestUrl === '') { return; }   
    var locale = utils.locale;
    var locale = locale.replace("_", "-");

    var URL = self.sprintf(m_suggestUrl, { searchTerms: val, lang: locale, country: '' });

    {
      var xmlHttpRequest;
      xmlHttpRequest = new XMLHttpRequest();
      xmlHttpRequest.open("GET", URL, true);
      xmlHttpRequest.onreadystatechange = function () {
        if (xmlHttpRequest.readyState == 4) {
          if (xmlHttpRequest.status == 200) {
            var response;
            if (lastValue == val) {
              if (self.asDiv == null) {
                self.asDiv = document.getElementById('search-suggestion-pad');
              }
              // clean previous result
              self.asDiv.innerHTML = null;

              var response = xmlHttpRequest.response;

              if (typeof (SEARCH_ENGINES[user['sengine']]['SuggestParser']) == 'function') {
                response = SEARCH_ENGINES[user['sengine']]['SuggestParser'](response)
              }
              else {
                response = JSON.parse(response);
              }

              var completeSuggestion = response[1];
              resultsLength = completeSuggestion.length;
              for (var i = 0; i < resultsLength && i < 5; i++) {
                var resultVal = completeSuggestion[i];
                var row = document.createElement("li");

                var pos = resultVal.indexOf(val);
                if (pos != -1) {
                  row.innerHTML = resultVal.substr(0, pos + val.length) + "<b>" + resultVal.substr(pos + val.length) + "</b>";
                } else {
                  row.textContent = resultVal;
                }

                row.setAttribute("id", "auto-suggest-row" + i);
                row.index = i;
                row.isRow = true;
                row.addEventListener("mouseover", function (e) {
                  var row = e.currentTarget;
                  if (selectedRow != -1) document.getElementById("auto-suggest-row" + selectedRow).setAttribute("class", "");
                  row.setAttribute("class", "selected");
                  selectedRow = row.index;
                }, false);
                row.addEventListener("click", function (e) {
                  var row = e.currentTarget;
                  textBox.value = row.textContent;
                  self.onSearch(row.textContent);
                  e.preventDefault();
                }, false);

                self.asDiv.appendChild(row);

              }
              selectedRow = -1;
              if (resultsLength == 0) {
                self.asDiv.style.display = 'none';
              } else {
                self.asDiv.style.display = 'block';
              }
            }
          }
        }
      };
      xmlHttpRequest.send("");
    }
    //)
  }
  self.keyUp = function (e) {
    var keyCode = e.keyCode;
    if (keyCode != getKeyCode('ENTER')) { 
      if ((keyCode != getKeyCode('UP_ARROW')) && (keyCode != getKeyCode('DOWN_ARROW')) && (keyCode != getKeyCode('F5'))) {
        if (interval != null) {
          window.clearInterval(interval)
          interval = null;
        }
        lastValue = textBox.value;
        interval = setTimeout(self.getData, 10, textBox.value)
      }
    }
  }
  self.keyDown = function (e) {
    var keyCode = e.keyCode;
    /*
    if(keyCode==13){
      
      if(selectedRow!=-1){
        textBox.value = document.getElementById("auto-suggest-row" + selectedRow).textContent;
      }
      t.onSearch(textBox.value);
      return;
      
    }
    */

    // remove comments if you want to use autosuggest
    // if ((keyCode != getKeyCode('UP_ARROW')) && (keyCode != 40)) {
    // } else {
    //   if (keyCode == getKeyCode('UP_ARROW')) {
    //     if (selectedRow != -1) {
    //       document.getElementById("auto-suggest-row" + selectedRow).setAttribute("class", "");
    //     }
    //     selectedRow--;
    //     if (selectedRow < 0) {
    //       selectedRow = resultsLength - 1;
    //     }
    //   } else {
    //     if (selectedRow != -1) {
    //       document.getElementById("auto-suggest-row" + selectedRow).setAttribute("class", "");
    //     }
    //     selectedRow++;
    //     if (selectedRow >= resultsLength) {
    //       selectedRow = 0;
    //     }
    //   }
    //   var row = document.getElementById("auto-suggest-row" + selectedRow);
    //   row.setAttribute("class", "selected");
    //   textBox.value = row.textContent;
    // }
  }
  self.documentMouseDown = function (e) {
    if (e.explicitOriginalTarget != self.asDiv) {
      lastValue = "--";
      if (self.asDiv != null) {
        self.asDiv.style.display = 'none';
        try {
          document.getElementById("container").style.height = "3px";
        } catch (e) { console.log(e) }
      }
    }
  }

  self.setASdivPosition = function () {
    var el = textBox;
    var x = 0;
    var y = textBox.offsetHeight - 1;
    while ((el.offsetParent) && (el.tagName.toLowerCase() != 'body')) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    x += el.offsetLeft;
    y += el.offsetTop;
    if (self.asDiv != null) {
      self.asDiv.style.left = x + "px";
      self.asDiv.style.top = y + "px";
    }
  }

  self.onSearch = function (val) {
    lastValue = "--";
    if (self.asDiv != null) {
      self.asDiv.style.display = 'none';
      if (document.getElementById("container")) {
        document.getElementById("container").style.height = "29px";
      }
      self.action();
    }
  }

  self.changeSuggestUrl = function (aUrl) {
    m_suggestUrl = aUrl;
  }

  self.init();
};