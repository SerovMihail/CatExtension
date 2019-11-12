var bgInfo;
var settingsScreen, newTab;
var stickyNoteScreen;
var todoList;
var serverUrl = "";
const appName = "baby-animals";

const isVisible = elem =>
  !!elem &&
  !!(elem.offsetHeight || elem.offsetWidth || elem.getClientRects().length);

function applyLanguage(force) {
  let htmlElements;

  if (force) {
    htmlElements = document.querySelectorAll("[language-data]");
  } else {
    htmlElements = document.querySelectorAll(
      "[language-data]:not([language-data-done])"
    );
  }

  htmlElements.forEach(element => {
    let attr = element.getAttribute("language-data");
    let text = getLanguageText(attr);
    element.innerHTML = text;
    element.setAttribute("language-data-done", "");
  });
}

function getLanguageText(searchValue) {
  return chrome.i18n.getMessage(searchValue) || searchValue;
}

function addEventDelegate(element, name, selector, callback) {
  element.addEventListener(name, e => {
    let current = e.target;

    while (current) {
      if (current.matches(selector)) {
        callback(current, e);
        break;
      }

      current = current.parentElement;
    }
  });
}

function template(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function clickOutside() {
  document.body.click();
}



function onceClickOutside(e, callback) {
  const outsideClickListener = event => {
    if (!e.contains(event.target) && isVisible(e)) {
      callback();

      removeClickListener();
    }
  };

  const removeClickListener = () => {
    document.removeEventListener("click", outsideClickListener);
  };

  document.addEventListener("click", outsideClickListener);
}

function appendLeadingZero(input) {
  return input < 10 ? "0" + input : input;
}

function toggleVisibility(visibleElement) {
  let parent = visibleElement.parentElement;
  Array.from(parent.children).forEach(e => e.classList.add("d-none"));

  visibleElement.classList.remove("d-none");
}

function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function timeChecker() {
  const days = 5;
  const magicNumber = 86400;
  const oneHundred = 1000;
  const date = new Date();
  let start = localStorage.getItem("start");
  let check;
  if (start) {
    const timeStartNumber = new Date(start).getTime();
    const timeNow = date.getTime();
    check = timeNow - timeStartNumber >= days * magicNumber * oneHundred;
  } else {
    start = date.toISOString();
    localStorage.setItem("start", start);
    check = false;
  }
  return check;
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    try {
      let el = document.createElement("script");
      el.onload = resolve;
      el.onerror = reject;
      el.src = url;
      document.body.appendChild(el);
    } catch (e) {
      reject(e);
    }
  });
}
