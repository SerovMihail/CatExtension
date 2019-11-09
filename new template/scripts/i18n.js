function getLanguageText(key) {
    return chrome.i18n.getMessage(key) || key;
}

function applyLanguage(forceUpdate) {
    let selectedElements;

    if (forceUpdate) {
        selectedElements = document.querySelectorAll("[data-language]");
    } else {
        selectedElements = document.querySelectorAll("[data-language]:not([data-language-done])");
    }

    selectedElements.forEach(element => {
        let attribute = element.getAttribute("data-language");
        let langText = getLanguageText(attribute);
        element.innerHTML = langText;
        element.setAttribute("data-language-done", "");
    });
}

