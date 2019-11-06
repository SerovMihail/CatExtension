chrome.runtime.onInstalled.addListener(function (details) {

    if (details.reason == "install") {
        localStorage.setItem('installedAt', Date.now());
    }

    // if (details.reason == "install" || details.reason == "update") {
    //     localStorage.setItem('tour_shown_in_tab', true);
    //     localStorage.setItem('tour_shown_in_search', true);
    // }
});

chrome.webNavigation.onCommitted.addListener(navigationHandler);

function navigationHandler(details) {

    const tourShowInSearch = localStorage.getItem('tour_shown_in_search');

    if (details.transitionQualifiers.includes('from_address_bar') && tourShowInSearch && JSON.parse(tourShowInSearch)) {

        chrome.tabs.executeScript(details.tabId, {
            file: '/sc/vendor/JQuery.min.js'
        }, function () {

            chrome.tabs.executeScript(details.tabId, {
                file: '/sc/content/tutorial/embedableTour.js'
            });
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

                if (request.action === 'done') {
                    localStorage.setItem('tour_shown_in_search', false);
                    chrome.webNavigation.onCommitted.removeListener(navigationHandler);
                }

                return true;
            });

        });

    }
};