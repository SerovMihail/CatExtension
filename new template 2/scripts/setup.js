function Setup() {
    const UI_OPTIONS = [
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
      let value = localStorage.getItem(key);
  
      if (value) {
        return JSON.parse(value);
      } else {
        value = onNotFound();
        localStorage.setItem(key, JSON.stringify(value));
        return value;
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
  
      for (let option of UI_OPTIONS) {
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
      for (let option of UI_OPTIONS) {
        let optionElem = template(optionTemplate);
  
        optionElem
          .querySelector("[language-data-desc]")
          .setAttribute("language-data", option);
  
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