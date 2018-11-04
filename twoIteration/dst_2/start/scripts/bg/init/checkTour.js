chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install" || details.reason == "update") {
        localStorage.setItem('tour_shown', true);
    }
});

chrome.webNavigation.onCommitted.addListener(navigationHandler);

function navigationHandler(details) {

    if (details.transitionQualifiers.includes('from_address_bar')) {

        chrome.webNavigation.onCommitted.removeListener(navigationHandler);

        chrome.tabs.executeScript(details.tabId, {
            file: '/start/scripts/libs/jquery.min.js'
        }, function () {

            chrome.tabs.executeScript(details.tabId, {
                file: '/start/scripts/content/tour/embedableTour.js'
            });
        });
    }
};


