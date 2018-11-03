chrome.runtime.onInstalled.addListener(function (details) {    
    if (details.reason == "install" || details.reason == "update") {
        localStorage.setItem('tour_shown', true);
    }
});

