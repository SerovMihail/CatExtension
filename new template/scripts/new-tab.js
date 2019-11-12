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
  
      bg.style.backgroundImage = `url(/cover-images/${selectingBgInfo.FileName})`;
      bg.style.backgroundPosition = "center";
    };
  
    this.addEventListeners = () => {

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
      chrome.runtime.getPackageDirectoryEntry(function(entry) {
        entry.getDirectory("cover-images", {}, function(imagesDirectory) {
          var dirReader = imagesDirectory.createReader();
          var buffer = [];
          getEntries = function(callback) {
            dirReader.readEntries(
              function(folders) {
                if (folders.length) {
                  for (var idx in folders) {
                    buffer.push(folders[idx]);
                  }
                  getEntries(callback);
                } else {
                  callback(buffer);
                }
              },
              function(error) {
                /* handle error -- error is a FileError object */
              }
            );
          };
          getEntries(function(buffer) {
            self.bgInfo = buffer.map(function(el) {
              return {
                FileName: el.name
              };
            });
            self.showBg();
          });
        });
      });
  
      this.updateClock();
      this.initializePopper();
      this.addEventListeners();
      this.setMostVisitedSites();    //this.showAppList();
      this.resetAutoHide();
      this.checkAutoHide();
    };
  
    return this;
  }