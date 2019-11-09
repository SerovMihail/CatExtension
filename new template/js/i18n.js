function applyLanguage(force) {
    let elements;

    if (force) {
        elements = document.querySelectorAll("[data-language]");
    } else {
        elements = document.querySelectorAll("[data-language]:not([data-language-done])");
    }

    elements.forEach(e => {
        let key = e.getAttribute("data-language");
        let message = getLanguageText(key);
        e.innerHTML = message;
        e.setAttribute("data-language-done", "");
    });
}

function getLanguageText(key) {
    return chrome.i18n.getMessage(key) || key;
}