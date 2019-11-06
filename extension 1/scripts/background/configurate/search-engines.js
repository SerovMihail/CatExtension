(function(window){
  "use strict";

  window.SEARCH_ENGINES = {
    'google' : {
      "ShortName": "Search",
      "LongName" : "Search",
      "InputEncoding" : "UTF-8",
      "SearchUrl": "http://google.com/search?q={searchTerms}",
    }
  };

  window.SEARCH_ENGINES_IS = [];
  window.SEARCH_ENGINES_ORDER = ['google'];
  window.SEARCH_ENGINES_DEFAULT = SEARCH_ENGINES_ORDER[0];

})(this);
