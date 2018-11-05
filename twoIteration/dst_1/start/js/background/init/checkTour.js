chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install" || details.reason == "update") {

        localStorage.setItem('tour_shown_in_tab', true);
        localStorage.setItem('tour_shown_in_search', true);

        chrome.webNavigation.onCommitted.addListener(navigationHandler);

        function navigationHandler(details) {

            const tourShowInSearch = localStorage.getItem('tour_shown_in_search'); 

            if (details.transitionQualifiers.includes('from_address_bar') && tourShowInSearch && JSON.parse(tourShowInSearch)) {

                chrome.webNavigation.onCommitted.removeListener(navigationHandler);

                chrome.tabs.executeScript(details.tabId, {
                    file: '/start/js/libs/jquery.min.js'
                }, function () {

                    chrome.tabs.executeScript(details.tabId, {
                        file: '/start/js/contentModules/tour/embedableTour.js'
                    });
                });

            }
        };
    }
});