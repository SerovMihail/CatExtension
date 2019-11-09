chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    chrome.tabs.create({});
  }
});

chrome.browserAction.onClicked.addListener(function(activeTab) {
  chrome.tabs.create({});
});